output "nginx_ingress_loadbalancer_url" {
  description = "The external URL of the NGINX Ingress Controller"
  value       = data.kubernetes_service.nginx_ingress.status[0].load_balancer[0].ingress[0].hostname
}

output "nginx_ingress_service_name" {
  description = "The name of the NGINX Ingress service"
  value       = data.kubernetes_service.nginx_ingress.metadata[0].name
}

output "nginx_ingress_service_namespace" {
  description = "The namespace of the NGINX Ingress service"
  value       = data.kubernetes_service.nginx_ingress.metadata[0].namespace
}

output "nginx_ingress_service_type" {
  description = "The type of the NGINX Ingress service"
  value       = data.kubernetes_service.nginx_ingress.spec[0].type
}
