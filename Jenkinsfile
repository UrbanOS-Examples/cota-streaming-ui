library(
    identifier: 'pipeline-lib@4.3.4',
    retriever: modernSCM([$class: 'GitSCMSource',
                          remote: 'https://github.com/SmartColumbusOS/pipeline-lib',
                          credentialsId: 'jenkins-github-user'])
)

properties([
    pipelineTriggers([scos.dailyBuildTrigger('12-13')]), //UTC
])

def image
def doStageIf = scos.&doStageIf
def doStageIfRelease = doStageIf.curry(scos.changeset.isRelease)
def doStageUnlessRelease = doStageIf.curry(!scos.changeset.isRelease)
def doStageIfPromoted = doStageIf.curry(scos.changeset.isMaster)

node('infrastructure') {
    ansiColor('xterm') {
        scos.doCheckoutStage()

        doStageUnlessRelease('Build') {
            image = docker.build("scos/cota-streaming-ui:${env.GIT_COMMIT_HASH}")
        }

        doStageUnlessRelease('Deploy to Dev') {
            scos.withDockerRegistry {
                image.push()
                image.push('latest')
            }
            deployUiTo(environment: 'dev')
            runSmokeTestAgainst('dev')
        }


        doStageIfPromoted('Deploy to Staging') {
            def environment = 'staging'

            deployUiTo(environment: environment)
            runSmokeTestAgainst(environment)

            scos.applyAndPushGitHubTag(environment)

            scos.withDockerRegistry {
                image.push(environment)
            }
        }

        doStageIfRelease('Deploy to Production') {
            def releaseTag = env.BRANCH_NAME
            def promotionTag = 'prod'

            deployUiTo(environment: 'prod', internal: false)
            runSmokeTestAgainst('prod')

            scos.applyAndPushGitHubTag(promotionTag)

            scos.withDockerRegistry {
                image = scos.pullImageFromDockerRegistry("scos/cota-streaming-ui", env.GIT_COMMIT_HASH)
                image.push(releaseTag)
                image.push(promotionTag)
            }
        }
    }
}

def deployUiTo(params = [:]) {
    def environment = params.get('environment')
    if (environment == null) throw new IllegalArgumentException("environment must be specified")

    def internal = params.get('internal', true)

    scos.withEksCredentials(environment) {
        def terraformOutputs = scos.terraformOutput(environment)
        def subnets = terraformOutputs.public_subnets.value.join(/\\,/)
        def allowInboundTrafficSG = terraformOutputs.allow_all_security_group.value
        def certificateARNs = [terraformOutputs.root_tls_certificate_arn.value,terraformOutputs.tls_certificate_arn.value].join(/\\,/)
        def ingressScheme = internal ? 'internal' : 'internet-facing'
        def dnsZone = terraformOutputs.internal_dns_zone_name.value
        def rootDnsZone = terraformOutputs.root_dns_zone_name.value

        sh("""#!/bin/bash
            set -e
            helm init --client-only
            helm upgrade --install cota-streaming-ui ./chart \
                --namespace cota-services \
                --set env="${environment}" \
                --namespace=cota-services \
                --set ingress.enabled="true" \
                --set ingress.scheme="${ingressScheme}" \
                --set ingress.subnets="${subnets}" \
                --set ingress.securityGroups="${allowInboundTrafficSG}" \
                --set ingress.dnsZone="${dnsZone}" \
                --set ingress.rootDnsZone="${rootDnsZone}" \
                --set ingress.certificateARN="${certificateARNs}" \
                --set image.tag="${env.GIT_COMMIT_HASH}"
        """.trim())
    }
}

def runSmokeTestAgainst(environment) {
    dir('smoke-test') {
        def smoker = docker.build("cota-smoke-test")

        //TODO: change this to use terraform output root_dns_zone_name.  Currently there is a bug with terraform and the prod dns has a . on the end
        def envUrlMap = [
            "dev": "dev-smartos.com",
            "staging": "staging-smartos.com",
            "prod": "smartcolumbusos.com"
        ]
        retry(60) {
            sleep(time: 5, unit: 'SECONDS')
            smoker.withRun("-e ENDPOINT_URL=cota.${envUrlMap[environment]}") { container ->
                sh "docker logs -f ${container.id}"
                sh "exit \$(docker inspect ${container.id} --format='{{.State.ExitCode}}')"
            }
        }
    }
}
