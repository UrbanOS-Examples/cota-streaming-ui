library(
    identifier: 'pipeline-lib@master',
    retriever: modernSCM([$class: 'GitSCMSource',
                          remote: 'https://github.com/SmartColumbusOS/pipeline-lib',
                          credentialsId: 'jenkins-github-user'])
)

node('master') {
    ansiColor('xterm') {
        stage('Checkout') {
            deleteDir()
            env.GIT_COMMIT_HASH = checkout(scm).GIT_COMMIT

            withCredentials([usernamePassword(credentialsId: 'jenkins-github-user', passwordVariable: 'GIT_PWD', usernameVariable: 'GIT_USER')]) {
                sh 'git remote add github https://$GIT_USER:$GIT_PWD@github.com/SmartColumbusOS/cota-streaming-ui.git'
            }
        }

        def image
        stage('Build') {
            image = docker.build("scos/cota-streaming-ui:${env.GIT_COMMIT_HASH}")
        }

        stage('Deploy to Dev') {
            scos.withDockerRegistry {
                image.push()
                image.push('latest')
            }
            def environment = 'dev'
            deploy(environment)
            runSmokeTest(environment)
        }


        if (env.BRANCH_NAME == 'master') {
            def tag = scos.releaseCandidateNumber()
            stage('Deploy to Staging') {
                sh "git tag ${tag}"

                def environment = 'staging'
                deploy(environment)
                runSmokeTest(environment)

                sh "git push github ${tag}"
                scos.withDockerRegistry {
                    image.push(tag)
                }
            }
        }
    }
}

def deploy(environment) {
    sh("sed -i 's/%VERSION%/${env.GIT_COMMIT_HASH}/' k8s/deployment/1-deployment.yaml")
    kubernetesDeploy(kubeconfigId: "kubeconfig-${environment}",
            configs: "k8s/configs/${environment}.yaml,k8s/deployment/*",
            secretName: 'regcred',
            dockerCredentials: [
                [credentialsId: 'ecr:us-east-2:aws_jenkins_user', url: 'https://199837183662.dkr.ecr.us-east-2.amazonaws.com'],
            ]
    )
}

def runSmokeTest(environment) {
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


            retry(2) {
                sleep(time: 1, unit: 'MINUTES')
                smoker.withRun("-e ENDPOINT_URL=cota.${environment}.smartcolumbusos.com") { container ->
                    sh "docker logs -f ${container.id}"
                    sh "exit \$(docker inspect ${container.id} --format='{{.State.ExitCode}}')"
                }
            }
        }
    }
}