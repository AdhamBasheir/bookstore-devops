resource "helm_release" "argocd" {
  name       = "argocd"
  repository = "https://argoproj.github.io/argo-helm"
  chart      = "argo-cd"
  namespace  = "argocd"
  version    = "6.4.0"

  create_namespace = true

  values = [
    file("${path.module}/argocd-values.yaml")
  ]
}
