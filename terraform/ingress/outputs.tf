output "nginx_ingress_service_name" {
  description = "The name of the NGINX Ingress service"
  value       = data.kubernetes_service.nginx_ingress.metadata[0].name
}

output "nginx_ingress_service_namespace" {
  description = "The namespace of the NGINX Ingress service"
  value       = data.kubernetes_service.nginx_ingress.metadata[0].namespace
}
