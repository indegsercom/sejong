cat <<EOF >./kustomization.yaml
secretGenerator:
- name: indegser-secret
  literals:
  - DATABASE_URL=$DATABASE_URL
  - JWT_SECRET=$JWT_SECRET
  - AWS_ID=$AWS_ID
  - AWS_SECRET=$AWS_SECRET
generatorOptions:
  disableNameSuffixHash: true
EOF

kubectl apply -k .