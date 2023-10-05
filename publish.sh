#!/usr/bin/env bash

S3_BUCKET=wwwaap
AWS_DISTRIBUTION_ID=E29GS7X40JZ0WS
AWS_REGION=ap-northeast-2

aws s3 sync ./dist s3://$S3_BUCKET \
  --exclude="*" \
  --include="**/*.js.br" \
  --content-encoding br \
  --content-type="application/javascript"
  
aws s3 sync ./dist s3://$S3_BUCKET \
  --exclude="*" \
  --include="*.html.br" \
  --content-encoding br \
  --content-type="text/html"
aws s3 sync ./dist s3://$S3_BUCKET \
  --exclude="**/*.js.br" \
  --exclude="*.html.br"
aws s3 sync ./dist s3://$S3_BUCKET --delete

aws cloudfront create-invalidation \
    --distribution-id $AWS_DISTRIBUTION_ID \
    --paths "/index.html" "/index.html.br"