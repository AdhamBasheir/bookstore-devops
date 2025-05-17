module "vpc" {
  source = "terraform-aws-modules/vpc/aws"

  name = var.vpc_name
  cidr = var.vpc_cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway = true
  enable_vpn_gateway = false

  tags = {
    Terraform   = "true"
    Environment = "library-devops"
  }
}

resource "aws_security_group" "frontend_sg" {
  name        = "frontend-sg"
  description = "Allow HTTP traffic to frontend"
  vpc_id      = module.vpc.vpc_id

  # Inbound rule: Allow HTTP traffic on port 80 from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] # Allow from anywhere
  }

  # Outbound rule: Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"          # -1 means all traffic
    cidr_blocks = ["0.0.0.0/0"] # Allow to anywhere
  }

  tags = {
    Terraform   = "true"
    Environment = "library-devops"
  }
}

resource "aws_security_group" "backend_sg" {
  name        = "backend-sg"
  description = "Allow HTTP traffic to backend from frontend"
  vpc_id      = module.vpc.vpc_id

  # Inbound rule: Allow HTTP traffic from the frontend
  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.frontend_sg.id]
  }

  # Outbound rule: Allow all outbound traffic
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"          # -1 means all traffic
    cidr_blocks = ["0.0.0.0/0"] # Allow to anywhere
  }

  tags = {
    Terraform   = "true"
    Environment = "library-devops"
  }
}

