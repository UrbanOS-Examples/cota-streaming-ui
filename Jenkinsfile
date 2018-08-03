def uiImage

node('master') {
    ansiColor('xterm') {
        stage('Checkout') {
            env.GIT_COMMIT_HASH = checkout(scm).GIT_COMMIT
        }

        stage('Build') {
            uiImage = docker.build("scos/cota-streaming-ui:${env.GIT_COMMIT_HASH}")
        }

        if (env.BRANCH_NAME == 'master') {
                stage('Publish') {
                    docker.withRegistry("https://199837183662.dkr.ecr.us-east-2.amazonaws.com", "ecr:us-east-2:aws_jenkins_user") {
                        uiImage.push()
                        uiImage.push('latest')
                    }
                }

            def environment = 'dev'

            stage('Deploy to Dev') {
                sh("sed -i 's/%VERSION%/${env.GIT_COMMIT_HASH}/' k8s/deployment/1-deployment.yaml")
                kubernetesDeploy(kubeconfigId: "kubeconfig-${environment}",
                        configs: "k8s/configs/${environment}.yaml,k8s/deployment/*",
                        secretName: 'regcred',
                        dockerCredentials: [
                            [credentialsId: 'ecr:us-east-2:aws_jenkins_user', url: 'https://199837183662.dkr.ecr.us-east-2.amazonaws.com'],
                        ]
                )
            }

            stage('Run Smoke Tester') {
                dir('smoke-test') {
                    def smoker = docker.build("cota-smoke-test")

                    timeout(time: 2, unit: 'MINUTES') {
                         sh("""#!/bin/bash -e
                            export AWS_CONFIG_FILE=/var/jenkins_home/.aws/config
                            export AWS_SHARED_CREDENTIALS_FILE=/var/jenkins_home/.aws/credentials
                            export AWS_PROFILE=${environment}

                            TARGET_GROUP_ARN=\$(aws elbv2 describe-target-groups --names cota-ui-lb-tg-${environment} | jq --raw-output .TargetGroups[].TargetGroupArn)

                            until aws elbv2 describe-target-health --region us-west-2 --target-group-arn \$TARGET_GROUP_ARN | jq --raw-output .TargetHealthDescriptions[].TargetHealth.State | grep "^healthy"; do
                                echo "waiting for load balancer to come online"
                                sleep 1
                            done
                        """.trim())


                        smoker.withRun("-e ENDPOINT_URL=cota.${environment}.smartcolumbusos.com") { container ->
                            sh "docker logs -f ${container.id}"
                            sh "exit \$(docker inspect ${container.id} --format='{{.State.ExitCode}}')"
                        }
                    }
                }
            }
        }
    }
}
