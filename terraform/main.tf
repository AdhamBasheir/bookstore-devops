# Terraform backends can't use var or locals. Instead, use a separate backend.tfvars file with bucket, key, region, and other backend settings, and pass it during init:
# terraform init -backend-config=backend.tfvars
terraform {
  backend "s3" {
    bucket       = "library-devops-terraform-state-bucket"
    key          = "terraform.tfstate"
    region       = "eu-north-1"
    use_lockfile = true
  }
}

module "library-vpc" {
  source = "./vpc"
}

module "eks" {
  source              = "./eks"
  cluster_name        = "library-devops-cluster"
  vpc_id              = module.library-vpc.vpc_id
  public_subnets_ids  = module.library-vpc.public_subnets_ids
  private_subnets_ids = module.library-vpc.private_subnets_ids
}
