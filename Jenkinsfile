library(
    identifier: 'pipeline-lib@1.2.1',
    retriever: modernSCM([$class: 'GitSCMSource',
                          remote: 'https://github.com/SmartColumbusOS/pipeline-lib',
                          credentialsId: 'jenkins-github-user'])
)

def image
def currentTagIsReadyForProduction = scos.isRelease(env.BRANCH_NAME)
def currentTagIsReadyForStaging = env.BRANCH_NAME == "master"
def doStageIf = scos.&doStageIf

node('master') {
    ansiColor('xterm') {
        stage('Checkout') {
            deleteDir()
            env.GIT_COMMIT_HASH = checkout(scm).GIT_COMMIT

            scos.addGitHubRemoteForTagging("SmartColumbusOS/cota-streaming-ui.git")
        }

        doStageIf(!currentTagIsReadyForProduction, 'Build') {
            image = docker.build("scos/cota-streaming-ui:${env.GIT_COMMIT_HASH}")
        }

        doStageIf(!currentTagIsReadyForProduction, 'Deploy to Dev') {
            scos.withDockerRegistry {
                image.push()
                image.push('latest')
            }
            deploy('dev')
            runSmokeTest('dev')
        }


        doStageIf(currentTagIsReadyForStaging, 'Deploy to Staging') {
            def promotionTag = scos.releaseCandidateNumber()

            deploy('staging')
            runSmokeTest('staging')

            scos.applyAndPushGitHubTag(promotionTag)

            scos.withDockerRegistry {
                image.push(promotionTag)
            }
        }

        doStageIf(currentTagIsReadyForProduction, 'Deploy to Production') {
            def releaseTag = env.BRANCH_NAME
            def promotionTag = 'prod'

            deploy('prod')
            runSmokeTest(promotionTag)

            scos.applyAndPushGitHubTag(promotionTag)

            scos.withDockerRegistry {
                image = scos.pullImageFromDockerRegistry("scos/cota-streaming-ui", env.GIT_COMMIT_HASH)
                image.push(releaseTag)
                image.push(promotionTag)
            }
        }
    }
}

def deploy(environment) {
    scos.withEksCredentials(environment) {
        def terraformOutputs = scos.terraformOutput(environment)
        def subnets = terraformOutputs.public_subnets.value.join(', ')
        def allowInboundTrafficSG = terraformOutputs.allow_all_security_group.value

        sh("""#!/bin/bash
            set -e
            export VERSION="${env.GIT_COMMIT_HASH}"
            export DNS_ZONE="${environment}.internal.smartcolumbusos.com"
            export SUBNETS="${subnets}"
            export SECURITY_GROUPS="${allowInboundTrafficSG}"

            kubectl apply -f k8s/configs/${environment}.yaml
            for manifest in k8s/deployment/*; do
                cat \$manifest | envsubst | kubectl apply -f -
            done
        """.trim())
    }
}

def runSmokeTest(environment) {
    dir('smoke-test') {
        def smoker = docker.build("cota-smoke-test")

        timeout(time: 2, unit: 'MINUTES') {
            sh("""#!/bin/bash -e
                export AWS_CONFIG_FILE=/var/jenkins_home/.aws/config
                export AWS_SHARED_CREDENTIALS_FILE=/var/jenkins_home/.aws/credentials
                export AWS_PROFILE=${environment}

                LOAD_BALANCER_ARN=\$(aws elbv2 --region=us-west-2 describe-load-balancers | jq --raw-output '.LoadBalancers[] | select(.LoadBalancerName | contains("default-cotaui")) | .LoadBalancerArn')
                TARGET_GROUP_ARN=\$(aws elbv2 --region=us-west-2 describe-target-groups --load-balancer-arn \$LOAD_BALANCER_ARN | jq --raw-output .TargetGroups[].TargetGroupArn)

                until aws elbv2 describe-target-health --region us-west-2 --target-group-arn \$TARGET_GROUP_ARN | jq --raw-output .TargetHealthDescriptions[].TargetHealth.State | grep "^healthy"; do
                    echo "waiting for load balancer to come online"
                    sleep 1
                done
            """.trim())

            retry(25) {
                sleep(time: 5, unit: 'SECONDS')
                smoker.withRun("-e ENDPOINT_URL=cota.${environment}.internal.smartcolumbusos.com") { container ->
                    sh "docker logs -f ${container.id}"
                    sh "exit \$(docker inspect ${container.id} --format='{{.State.ExitCode}}')"
                }
            }
        }
    }
}