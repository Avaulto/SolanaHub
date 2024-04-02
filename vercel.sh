#!/bin/bash
 
if [[ $VERCEL_GIT_COMMIT_REF == "main"  ]] ; then 
  echo "This is our main branch"
  npm run build:main
else 
  echo "This is dev branch"
  npm run build:dev
fi


# sh vercel.sh