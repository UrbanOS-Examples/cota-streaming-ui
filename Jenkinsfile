node('master') {
    stage('Checkout') {
        checkout scm
        GIT_COMMIT_HASH = sh (
            script: 'git rev-parse HEAD',
            returnStdout: true
        ).trim()
    }
    stage('Build') {
	sh('npm install')
	sh('npm run test')
	sh('npm run build')
        docker.build("scos/cota_streaming_ui:${GIT_COMMIT_HASH}")
    }
    stage('Test') {
        docker.image("scos/cota_streaming_ui:${GIT_COMMIT_HASH}")
            .inside() {
                sh('')
            }
    }
}
