module.exports = function(grunt) {

  // Project configuration.
  var config =
    { stylus:
      { uncompressed:
        { options:
          { compress: false
          , data: { debug: true }
          }
        , files: { 'public/css/main.css': 'public/stylus/main.styl' }
        }
      , compressed:
        { options:
          { compress: true
          , data: { debug: false }
          }
        , files: { 'public/css/main.css': 'public/stylus/main.styl' }
        }
      }
    , watch:
      { stylus:
        { files: ['public/stylus/**/**.styl']
        , tasks: 'stylus'
        , options: { livereload: true }
        }
      }
    }

  grunt.initConfig(config)

  grunt.loadNpmTasks('grunt-contrib-stylus')
  grunt.loadNpmTasks('grunt-contrib-watch')

  // Tasks
  grunt.registerTask('default', ['stylus:uncompressed', 'watch'])
  grunt.registerTask('build', ['stylus:uncompressed'])
  grunt.registerTask('deploy', ['stylus:compressed'])

}