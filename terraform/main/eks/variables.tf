variable "cluster_name" {
  description = "EKS cluster name"
  type        = string
  default     = "library-devops-cluster"
}

variable "cluster_version" {
  description = "Kubernetes version"
  type        = string
  default     = "1.32"
}

variable "public_subnets_ids" {
  description = "List of public subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "private_subnets_ids" {
  description = "List of private subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "vpc_id" {
  description = "VPC ID where EKS will be deployed"
  type        = string
}
