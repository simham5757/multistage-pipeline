pipeline {
    agent any
    options {
    skipDefaultCheckout(true)
    }

    parameters {
    choice(name: 'BRANCH',choices: ['master','dev','qa'],description: 'select branch')
    booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run unit tests?')
    }
    stages {
       stage('checkout') {
         steps {
             git branch: "${params.BRANCH}",url:  'https://github.com/simham5757/multistage-pipeline.git'
         }
       }
       stage('build node app') {
         steps {
              sh 'npm install'
              sh 'npm run build'
         }
       }
   
       stage('test') {
         when {
               expression { return params.RUN_TESTS }
         }
         steps {
            sh 'npm test'
         }
       } 
       stage('docker build') {
         steps {
           sh 'docker build -t mytub/hello-node:${env.BUILD_NUMBER} .'
         }
       }
       stage('push image') {
         steps {
          withDockerRegistry(credentialsId: 'dockerhub_creds', url: 'https://index.docker.io/v1/') {

               sh  'docker push mytub/hello-node:${env.BUILD_NUMBER}'

          }
        }
      }

       stage('archive artifcat') {
         when {
              expression { return params.BRANCH == 'master' }
         }
         steps {
             archiveArtifacts artifacts : 'target/*.jar', fingerprint: true
         }
       }
       stage ('deploy to k3') {
         steps {
            sh '''
            sed -i "s#image:.*#image: mytub/hello-node:${BUILD_NUMBER}#g" deployment-nodejs.yaml
            kubectl apply-f  deployment-nodejs.yaml
            '''
         }
      }

   }
 post {
   success {
     echo "build is successfull"
   }
   failure {
     echo "build is failed"
   }
 }
}
