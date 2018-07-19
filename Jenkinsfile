properties([
    parameters([
        credentials(
            credentialType: 'com.microsoft.jenkins.kubernetes.credentials.KubeconfigCredentials',
            defaultValue: 'kubeconfig-dev',
            description: 'Environment to deploy to',
            name: 'kubernetesCreds',
            required: true
        )
    ]),
    disableConcurrentBuilds()
])

node('master') {
    ansiColor('xterm') {
        def uiImage
        def testImage

        stage('Checkout') {
            checkout scm
            GIT_COMMIT_HASH = sh (
                script: 'git rev-parse HEAD',
                returnStdout: true
            ).trim()
        }

        stage('Build Smoke Tester') {
            dir('smoke-test') {
                testImage = docker.build("scos/cota-streaming-ui-smoke-test:${GIT_COMMIT_HASH}")
            }
        }

        stage('Publish Smoke Tester') {
            dir('smoke-test') {
                docker.withRegistry("https://199837183662.dkr.ecr.us-east-2.amazonaws.com", "ecr:us-east-2:aws_jenkins_user") {
                    testImage.push()
                    testImage.push('latest')
                }
            }
        }

        stage('Build') {
            uiImage = docker.build("scos/cota-streaming-ui:${GIT_COMMIT_HASH}")
        }

        stage('Publish') {
            docker.withRegistry("https://199837183662.dkr.ecr.us-east-2.amazonaws.com", "ecr:us-east-2:aws_jenkins_user") {
                uiImage.push()
                uiImage.push('latest')
            }
        }

        stage('Deploy to Dev') {
            build job: 'deploy-cota-streaming-ui', parameters: [credentials(name: 'kubernetesCreds', value: 'kubeconfig-dev')]
        }

        stage('Run Smoke Tester') {
            dir('smoke-test') {
                kubernetesDeploy(
                    kubeconfigId: "${params.kubernetesCreds}",
                    configs: 'k8s/*',
                    secretName: 'regcred',
                    dockerCredentials: [
                        [
                            credentialsId: 'ecr:us-east-2:aws_jenkins_user',
                            url: 'https://199837183662.dkr.ecr.us-east-2.amazonaws.com'
                        ],
                    ]
                )
            }
        }

        stage ('Verify Smoke Test') {
            dir('smoke-test') {
                try {
                    timeout(10) {
                        sh('''\
                            #!/usr/bin/env bash
                            set -e

                            until kubectl logs -f cota-ui-smoke-tester 2>/dev/null; do
                                echo "waiting for smoke test docker to start"
                                sleep 1
                            done
                            
                            kubectl --output=json get pod cota-ui-smoke-tester \
                                | jq -r '.status.phase' \
                                | grep -qx "Succeeded"
                        '''.trim())
                    }
                }
                finally {
                    sh('kubectl delete -f k8s/')
                }
            }
        }
    }
}
