resource "helm_release" "nginx_ingress" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "library-devops"
  version          = "4.10.0"
  create_namespace = true

  values = [
    file("${path.module}/nginx-ingress-values.yaml")
  ]
}
