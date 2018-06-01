node('master') {
    stage('Checkout') {
        checkout scm
        GIT_COMMIT_HASH = sh (
            script: 'git rev-parse HEAD',
            returnStdout: true
        ).trim()
    }
    stage('Build') {
        docker.build("scos/cota_streaming_ui:${GIT_COMMIT_HASH}")
    }
    stage('Push to Repository') {
	sh ('echo Here is where we would push this image to ECR or nexus')
    }
}
