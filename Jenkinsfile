def image

pipeline {
    agent any

    options {
        ansiColor('xterm')
    }

    parameters {
        credentials(
            credentialType: 'com.microsoft.jenkins.kubernetes.credentials.KubeconfigCredentials',
            defaultValue: 'kubeconfig-dev',
            description: 'Environment to deploy to',
            name: 'kubernetesCreds',
            required: true
        )
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    GIT_COMMIT_HASH = sh (
                        script: 'git rev-parse HEAD',
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    image = docker.build("scos/cota-streaming-ui:${GIT_COMMIT_HASH}")
                }
            }
        }

        stage('Publish') {
            when {
                branch 'master'
            }
            steps {
                script {
                    docker.withRegistry("https://199837183662.dkr.ecr.us-east-2.amazonaws.com", "ecr:us-east-2:aws_jenkins_user") {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }

        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                sh("sed -i 's/%VERSION%/${GIT_COMMIT_HASH}/' k8s/deployment/1-deployment.yaml")
                kubernetesDeploy(kubeconfigId: "${params.kubernetesCreds}",
                    configs: 'k8s/configs/dev.yaml,k8s/deployment/*',
                    secretName: 'regcred',
                    dockerCredentials: [
                        [credentialsId: 'ecr:us-east-2:aws_jenkins_user', url: 'https://199837183662.dkr.ecr.us-east-2.amazonaws.com'],
                    ]
                )
            }
        }
    }
}
