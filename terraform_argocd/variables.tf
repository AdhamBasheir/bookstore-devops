variable "region" {
  default = "eu-north-1"
  type    = string
}

variable "cluster_name" {
  default = "library-devops-cluster"
  type    = string
}

variable "cluster_endpoint" {
  description = "EKS cluster endpoint"
  type        = string
}

variable "cluster_ca_certificate" {
  description = "EKS cluster CA certificate"
  type        = string
}

variable "cluster_token" {
  description = "Authentication token to connect to the EKS cluster"
  type        = string
}
