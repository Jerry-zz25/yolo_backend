#!/bin/bash
# AWS CLI命令示例，用于创建EC2和RDS实例及相关资源
# 使用前请确保已安装配置AWS CLI和适当的IAM权限

# 替换以下变量为你的实际值
AWS_REGION="ap-southeast-1"  # 新加坡区域
KEY_NAME="your-key-pair"     # 已存在的EC2密钥对
VPC_ID="vpc-xxxxxxxx"        # 如果使用现有VPC，填写ID；否则留空，脚本将创建新VPC
PROJECT_NAME="anomaly-detection"
ENVIRONMENT="dev"

echo "开始创建异常检测系统基础设施..."

# 创建VPC (如果VPC_ID为空)
if [ -z "$VPC_ID" ]; then
  echo "创建新的VPC..."
  VPC_ID=$(aws ec2 create-vpc \
    --cidr-block 10.0.0.0/16 \
    --region $AWS_REGION \
    --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-vpc}]" \
    --output text --query 'Vpc.VpcId')
  
  echo "已创建VPC: $VPC_ID"
  
  # 启用DNS支持
  aws ec2 modify-vpc-attribute \
    --vpc-id $VPC_ID \
    --enable-dns-support "{\"Value\":true}" \
    --region $AWS_REGION
  
  # 启用DNS主机名
  aws ec2 modify-vpc-attribute \
    --vpc-id $VPC_ID \
    --enable-dns-hostnames "{\"Value\":true}" \
    --region $AWS_REGION
fi

# 创建互联网网关
echo "创建互联网网关..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-igw}]" \
  --output text --query 'InternetGateway.InternetGatewayId')

echo "已创建互联网网关: $IGW_ID"

# 将互联网网关附加到VPC
aws ec2 attach-internet-gateway \
  --internet-gateway-id $IGW_ID \
  --vpc-id $VPC_ID \
  --region $AWS_REGION

echo "互联网网关已附加到VPC"

# 创建公有子网
echo "创建公有子网..."
PUBLIC_SUBNET_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone "${AWS_REGION}a" \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-public-subnet}]" \
  --output text --query 'Subnet.SubnetId')

echo "已创建公有子网: $PUBLIC_SUBNET_ID"

# 创建私有子网(用于RDS)
echo "创建私有子网1..."
PRIVATE_SUBNET_1_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.2.0/24 \
  --availability-zone "${AWS_REGION}a" \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-private-subnet-1}]" \
  --output text --query 'Subnet.SubnetId')

echo "已创建私有子网1: $PRIVATE_SUBNET_1_ID"

echo "创建私有子网2..."
PRIVATE_SUBNET_2_ID=$(aws ec2 create-subnet \
  --vpc-id $VPC_ID \
  --cidr-block 10.0.3.0/24 \
  --availability-zone "${AWS_REGION}b" \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-private-subnet-2}]" \
  --output text --query 'Subnet.SubnetId')

echo "已创建私有子网2: $PRIVATE_SUBNET_2_ID"

# 创建公有路由表
echo "创建公有路由表..."
PUBLIC_ROUTE_TABLE_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-public-rt}]" \
  --output text --query 'RouteTable.RouteTableId')

echo "已创建公有路由表: $PUBLIC_ROUTE_TABLE_ID"

# 添加默认路由到互联网网关
aws ec2 create-route \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id $IGW_ID \
  --region $AWS_REGION

echo "已添加默认路由到互联网网关"

# 将公有子网与路由表关联
aws ec2 associate-route-table \
  --subnet-id $PUBLIC_SUBNET_ID \
  --route-table-id $PUBLIC_ROUTE_TABLE_ID \
  --region $AWS_REGION

echo "已将公有子网与路由表关联"

# 启用公有子网的自动分配公有IP
aws ec2 modify-subnet-attribute \
  --subnet-id $PUBLIC_SUBNET_ID \
  --map-public-ip-on-launch \
  --region $AWS_REGION

echo "已启用公有子网自动分配公有IP"

# 创建EC2安全组
echo "创建EC2安全组..."
EC2_SG_ID=$(aws ec2 create-security-group \
  --group-name "${PROJECT_NAME}-${ENVIRONMENT}-ec2-sg" \
  --description "EC2实例的安全组" \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --output text --query 'GroupId')

echo "已创建EC2安全组: $EC2_SG_ID"

# 给EC2安全组添加入站规则
aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

aws ec2 authorize-security-group-ingress \
  --group-id $EC2_SG_ID \
  --protocol tcp \
  --port 3000 \
  --cidr 0.0.0.0/0 \
  --region $AWS_REGION

echo "已添加EC2安全组入站规则"

# 创建RDS安全组
echo "创建RDS安全组..."
RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name "${PROJECT_NAME}-${ENVIRONMENT}-rds-sg" \
  --description "RDS实例的安全组" \
  --vpc-id $VPC_ID \
  --region $AWS_REGION \
  --output text --query 'GroupId')

echo "已创建RDS安全组: $RDS_SG_ID"

# 给RDS安全组添加入站规则
aws ec2 authorize-security-group-ingress \
  --group-id $RDS_SG_ID \
  --protocol tcp \
  --port 3306 \
  --source-group $EC2_SG_ID \
  --region $AWS_REGION

echo "已添加RDS安全组入站规则"

# 创建RDS子网组
echo "创建RDS子网组..."
aws rds create-db-subnet-group \
  --db-subnet-group-name "${PROJECT_NAME}-${ENVIRONMENT}-db-subnet-group" \
  --db-subnet-group-description "异常检测系统数据库子网组" \
  --subnet-ids "[$PRIVATE_SUBNET_1_ID, $PRIVATE_SUBNET_2_ID]" \
  --region $AWS_REGION

echo "已创建RDS子网组"

# 创建EC2实例
echo "创建EC2实例..."
EC2_INSTANCE_ID=$(aws ec2 run-instances \
  --image-id ami-078c1149d8ad719a7 \
  --instance-type t3.small \
  --key-name $KEY_NAME \
  --security-group-ids $EC2_SG_ID \
  --subnet-id $PUBLIC_SUBNET_ID \
  --region $AWS_REGION \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-app-server}]" \
  --user-data "file://ec2-userdata.sh" \
  --output text --query 'Instances[0].InstanceId')

echo "已创建EC2实例: $EC2_INSTANCE_ID"

# 创建RDS实例
echo "创建RDS实例..."
aws rds create-db-instance \
  --db-instance-identifier "${PROJECT_NAME}-${ENVIRONMENT}-mysql" \
  --db-instance-class db.t3.small \
  --engine mysql \
  --engine-version 8.0.31 \
  --master-username admin \
  --master-user-password "YourStrongPassword123" \
  --allocated-storage 20 \
  --db-name anomalydb \
  --vpc-security-group-ids $RDS_SG_ID \
  --db-subnet-group-name "${PROJECT_NAME}-${ENVIRONMENT}-db-subnet-group" \
  --backup-retention-period 7 \
  --no-multi-az \
  --storage-type gp2 \
  --no-publicly-accessible \
  --region $AWS_REGION \
  --tags "Key=Name,Value=${PROJECT_NAME}-${ENVIRONMENT}-mysql-db"

echo "正在创建RDS实例，将需要几分钟时间完成..."
echo "完成基础设施创建。" 