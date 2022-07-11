pipeline {
    agent any
    environment {
        GITLAB_TOKEN = "glpat-KmKraMFxFQ27bSY531Ai"
    }

    stages {
        stage('Build') {
            steps {
                echo "Build Start"
                sh "chmod +x docker_update.sh"
                sh "./docker_update.sh"
            }
        }
        stage('Test'){
            steps {
                echo "Test Start"
            }
        }
        stage('Deploy') {
            steps {
                echo "Deploy Start"
            }
        }
    }

    post {
        failure {
            updateGitlabCommitStatus name: 'build', state: 'failed'
        }
        success {
            updateGitlabCommitStatus name: 'build', state: 'success'
        }
    }
}