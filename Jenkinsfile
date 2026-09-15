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

          # Guardar versión previa para rollback
          PREV_RELEASE=$(readlink -f "${CURRENT_DIR}" || true)

          # Validar que index.html exista en el release
          if [ ! -f "$REL_PATH/index.html" ]; then
            echo "ERROR: El directorio de release no contiene index.html"
            exit 1
          fi

          # Cambiar symlink atómico
          sudo ln -sfn "$REL_PATH" "${CURRENT_DIR}"
          sudo chown -h deploy:deploy "${CURRENT_DIR}"
          sudo chown -R deploy:deploy "${RELEASES_DIR}"

          # Validar y recargar Nginx con rollback si la configuración falla
          if sudo nginx -t; then
            sudo systemctl reload nginx
            echo "Nginx recargado exitosamente."
          else
            echo "ALERTA: Configuración de Nginx inválida. Ejecutando rollback..."
            if [ -n "$PREV_RELEASE" ] && [ -d "$PREV_RELEASE" ]; then
              sudo ln -sfn "$PREV_RELEASE" "${CURRENT_DIR}"
              sudo systemctl reload nginx
            fi
            exit 1
          fi

          # Mantener 5 releases
          cd "${RELEASES_DIR}"
          ls -1t | tail -n +6 | xargs -r sudo rm -rf --
        '''
      }
    }
  }

  post {
    failure {
      echo "El despliegue de MesaFacil.UI ha fallado."
    }
    always { cleanWs() }
  }
}
