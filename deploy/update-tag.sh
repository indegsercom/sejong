dir="$(dirname "${0}")"

echo "images:
- name: gcr.io/indegser/sejong
  newTag: $VERSION
" >> $dir/kustomization.yaml

# Add patch
# echo "patchesJson6902:
#   - target:
#       group: apps
#       version: v1
#       kind: Deployment
#       name: sejong
#     path: $ENV/patch.json
# " >> $dir/kustomization.yaml

echo ---- Applied kustomization.yaml ----
cat $dir/kustomization.yaml
echo ------- Kustomization result -------
kubectl kustomize $dir
echo ------------------------------------