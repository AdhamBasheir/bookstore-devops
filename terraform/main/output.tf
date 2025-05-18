output "cluster_name" {
  value = module.library-eks.cluster_name
}

output "cluster_endpoint" {
  value = module.library-eks.cluster_endpoint
}

output "cluster_ca_certificate" {
  value = module.library-eks.cluster_ca_certificate
}

output "vpc_id" {
  value = module.library-vpc.vpc_id
}

output "private_subnets_ids" {
  value = module.library-vpc.private_subnets_ids
}

output "public_subnets_ids" {
  value = module.library-vpc.public_subnets_ids
}

output "frontend_sg_id" {
  value = module.library-vpc.frontend_sg_id
}

output "backend_sg_id" {
  value = module.library-vpc.backend_sg_id
}
