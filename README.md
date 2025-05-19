# 📚 Library Management System

A three-tier web application built with Node.js for managing a library system. It features a frontend interface, backend API, and a MongoDB Atlas database. The entire application is deployed on AWS Elastic Kubernetes Service (EKS) using Terraform.

---

## 🚀 Features

- Node.js backend with RESTful APIs
- MongoDB Atlas for cloud-based database storage
- Three-tier architecture (frontend, backend, database)
- Deployed on AWS EKS using Terraform
- GitOps-based CI/CD with ArgoCD
- NGINX Ingress Controller for traffic routing
- Prometheus and Grafana for monitoring and observability

---

## 🛠️ Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Infrastructure as Code**: Terraform (modular structure)
- **Containerization**: Docker
- **Orchestration**: Kubernetes (EKS)
- **CI/CD**: ArgoCD
- **Monitoring**: Prometheus + Grafana
- **Ingress**: NGINX Ingress Controller
- **Cloud Provider**: AWS

---

## 📦 Deployment Overview

1. **Terraform Modules**:  
   - VPC  
   - EKS Cluster  
   - Node Groups  
   - ArgoCD  
   - Ingress  
   - Prometheus & Grafana

2. **CI/CD**:  
   - ArgoCD auto-deploys new changes from GitHub

3. **Networking**:  
   - LoadBalancer service exposed through NGINX Ingress

---

## 📌 To Do

- [ ] Add authentication and authorization
- [ ] Add integration tests

---
