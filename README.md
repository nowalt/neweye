```
DATABASE_URL="mysql://s694jwcxdhlj:pscale_pw_xKcuHqltH7myEEuuLPfiVZ8LcQ4GMNGJ3Na1lb0z2GA@uwc2w42bitqv.ap-southeast-2.psdb.cloud/nowdiff?sslaccept=strict" npx prisma migrate deploy

pscale deploy-request create nowdiff dev
pscale deploy-request diff nowdiff 1
pscale deploy-request deploy nowdiff 1
```