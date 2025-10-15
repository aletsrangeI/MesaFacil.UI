pipeline {
  agent any
  environment {
    RELEASES_DIR = "/var/www/mesafacil/ui/releases"
    CURRENT_DIR  = "/var/www/mesafacil/ui/current"
    SHARED_DIR   = "/var/www/mesafacil/ui/shared"
  }
  options { timestamps(); buildDiscarder(logRotator(numToKeepStr: '20')) }

  stages {
    stage('Checkout') {
      when { branch 'Development' }
      steps { checkout scm }
    }

    stage('Install & Build') {
      when { branch 'Development' }
      steps {
        sh '''
          set -e
          node -v
          npm -v
          npm ci
          npm run build
          test -d dist
        '''
      }
    }

    stage('Deploy') {
      when { branch 'Development' }
      steps {
        sh '''
          set -e
          BUILD_ID_SHORT=$(git rev-parse --short HEAD)
          REL_PATH="${RELEASES_DIR}/${BUILD_ID}-${BUILD_ID_SHORT}"

          sudo mkdir -p "$REL_PATH"
          sudo rsync -a --delete "$(pwd)/dist/" "$REL_PATH/"

          # Si usas variables de entorno para el build:
          # [ -f "${SHARED_DIR}/.env.production" ] && sudo cp "${SHARED_DIR}/.env.production" "$REL_PATH/"

          sudo ln -sfn "$REL_PATH" "${CURRENT_DIR}"
          sudo chown -h deploy:deploy "${CURRENT_DIR}"
          sudo chown -R deploy:deploy "${RELEASES_DIR}"

          # Recarga Nginx
          sudo nginx -t && sudo systemctl reload nginx

          # Mantener 5 releases
          cd "${RELEASES_DIR}"
          ls -1t | tail -n +6 | xargs -r sudo rm -rf --
        '''
      }
    }
  }

  post { always { cleanWs() } }
}
