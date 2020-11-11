<template>
  <v-app id="3dmap">
    <div>
      <VueScriptComponent script='<link rel="stylesheet" type="text/css" href="/static/Potree/build/potree/potree.css">'/>
      <VueScriptComponent script='<link rel="stylesheet" type="text/css" href="/static/Potree/libs/jquery-ui/jquery-ui.min.css">'/>
      <VueScriptComponent script='<link rel="stylesheet" type="text/css" href="/static/Potree/libs/openlayers3/ol.css">'/>
      <VueScriptComponent script='<link rel="stylesheet" type="text/css" href="/static/Potree/libs/spectrum/spectrum.css">'/>
      <VueScriptComponent script='<link rel="stylesheet" type="text/css" href="/static/Potree/libs/jstree/themes/mixed/style.css">'/>

      <VueScriptComponent script='<script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/spectrum/spectrum.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/jquery-ui/jquery-ui.min.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/three.js/build/three.min.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/three.js/extra/lines.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/other/BinaryHeap.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/tween/tween.min.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/d3/d3.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/proj4/proj4.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/openlayers3/ol.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/i18next/i18next.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/jstree/jstree.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/build/potree/potree.js"></script>'/>
      <VueScriptComponent script='<script type="text/javascript" src="/static/Potree/libs/plasio/js/laslaz.js"></script>'/>
    </div>
    <!--<v-navigation-drawer-->
    <!--class="drawer"-->
    <!--:clipped="true"-->
    <!--:mobile-break-point="600"-->
    <!--v-model="drawer"-->
    <!--app-->
    <!--&gt;-->
    <!--<v-list dense>-->
    <!--<template v-for="(item, index) in items">-->
    <!--<v-card-->
    <!--light-->
    <!--raised>-->
    <!--<v-flex xs12>-->

    <!--<v-layout-->
    <!--v-if="item.title"-->
    <!--:key="index"-->
    <!--column-->
    <!--align-center-->
    <!--&gt;-->
    <!--<v-subheader v-if="item.title">-->
    <!--{{ item.title }}-->
    <!--</v-subheader>-->
    <!--<v-list-tile-content>-->
    <!--<v-list-tile-title>-->
    <!--{{ item.text }}-->
    <!--</v-list-tile-title>-->
    <!--</v-list-tile-content>-->
    <!--</v-layout>-->
    <!--</v-flex>-->
    <!--</v-card>-->
    <!--</template>-->
    <!--</v-list>-->
    <!--</v-navigation-drawer>-->

    <v-toolbar
      :clipped-left="true"
      color="blue darken-3"
      dark
      app
    >
      <v-btn icon class="hidden-xs-only"
             @click=goToPrevPage>
        <v-icon>cancel</v-icon>
      </v-btn>
      <v-toolbar-title class="toolbarTitle">
        {{ title }}
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <div class="potree_container"
           style="position: relative; width: 100%; height: 100%;">

        <div id="potree_render_area"
             ref="container">
        </div>
        <div id="potree_sidebar_container">

          <div id="sidebar_root"
               class="perfect_scrollbar navmenu navmenu-default navmenu-fixed-left unselectable">

            <!--<span class="potree_sidebar_brand">-->
            <!--<span id="potree_version_number"></span>-->
            <!--</span>-->

            <div class="action-buttons">
              <div class="textured-model-chkbox-container">
                <label>
                  <input type="checkbox"
                  /> Textured Model</label>
              </div>
            </div>

            <!--<div id="sidebar_header">-->
            <!--<span id="potree_branding" class="potree_sidebar_brand" style="display: flex; flex-direction: row">-->
            <!--<a href="http://potree.org" target="_blank">potree.org</a>-->
            <!--<span style="margin: 0px 3px; color: #9AA1A4"> - </span>-->
            <!--<a href="https://github.com/potree/potree" target="_blank">github</a>-->
            <!--<span style="margin: 0px 3px; color: #9AA1A4"> - </span>-->
            <!--<a href="https://twitter.com/m_schuetz" target="_blank">twitter</a>-->
            <!--<span style="flex-grow: 1"></span>-->
            <!--</span>-->
            <!--</div>-->

            <div id="potree_menu" class="accordion">

              <!-- APPEARANCE -->
              <h3 id="menu_appearance"><span data-i18n="tb.rendering_opt"></span></h3>
              <div>
                <ul class="pv-menu-list">
                  <li><span data-i18n="appearance.nb_max_pts"></span>: <span id="lblPointBudget"></span>
                    <div id="sldPointBudget"></div>
                  </li>
                  <li><span data-i18n="appearance.field_view"></span>: <span id="lblFOV"></span>
                    <div id="sldFOV"></div>
                  </li>

                  <div class="divider"><span>Eye-Dome-Lighting</span></div>

                  <li><label><input type="checkbox" id="chkEDLEnabled"/><span data-i18n="appearance.edl_enable"></span></label>
                  </li>
                  <li><span data-i18n="appearance.edl_radius"></span>: <span id="lblEDLRadius"></span>
                    <div id="sldEDLRadius"></div>
                  </li>
                  <li><span data-i18n="appearance.edl_strength"></span>: <span id="lblEDLStrength"></span>
                    <div id="sldEDLStrength"></div>
                  </li>

                  <div class="divider"><span>Background</span></div>

                  <li>
                    <select id="background_options">
                      <option id="background_options_skybox" value="skybox">Skybox</option>
                      <option id="background_options_gradient" value="gradient">Gradient</option>
                      <option id="background_options_black" value="black">Black</option>
                      <option id="background_options_white" value="white">White</option>
                      <option id="background_options_none" value="null">None</option>
                    </select>
                  </li>

                  <div class="divider"><span>Other</span></div>

                  <li>
                    <select id="splat_quality_options">
                      <option id="splat_quality_options_standard" value="standard">Standard</option>
                      <option id="splat_quality_options_hq" value="hq">High Quality</option>
                    </select>
                  </li>

                  <li><span data-i18n="appearance.min_node_size"></span>: <span id="lblMinNodeSize"></span>
                    <div id="sldMinNodeSize"></div>
                  </li>
                  <li><label><input id="show_bounding_box" type="checkbox"/><span
                    data-i18n="appearance.box"></span></label></li>
                  <li><label><input id="set_freeze" type="checkbox"/><span data-i18n="appearance.freeze"></span></label>
                  </li>
                </ul>

              </div>

              <!-- TOOLS -->
              <h3 id="menu_tools"><span data-i18n="tb.tools_opt"></span></h3>
              <div class="pv-menu-list">

                <div class="divider" style="padding: 10px 0px 15px 0px"><span>Measurement</span></div>

                <li id="tools"></li>

                <div class="divider" style="padding: 10px 0px 15px 0px"><span>Clipping</span></div>

                <li id="clipping_tools"></li>

                <li>
                  <select id="cliptask_options">
                    <option id="cliptask_options_none" value="NONE">None</option>
                    <option id="cliptask_options_highlight" value="HIGHLIGHT">Highlight</option>
                    <option id="cliptask_options_show_inside" value="SHOW_INSIDE">Inside</option>
                    <option id="cliptask_options_show_outside" value="SHOW_OUTSIDE">Outside</option>
                  </select>
                </li>

                <li>
                  <select id="clipmethod_options">
                    <option id="clipmethod_options_any" value="INSIDE_ANY">Inside Any</option>
                    <option id="clipmethod_options_all" value="INSIDE_ALL">Inside All</option>
                  </select>
                </li>

                <div class="divider" style="padding: 10px 0px 15px 0px"><span>Navigation</span></div>

                <li id="navigation"></li>

                <li><span data-i18n="appearance.move_speed"></span>: <span id="lblMoveSpeed"></span>
                  <div id="sldMoveSpeed"></div>
                </li>
              </div>

              <!-- SCENE -->
              <h3 id="menu_scene"><span data-i18n="tb.scene_opt"></span></h3>
              <div class="pv-menu-list">

                <div id="scene_export"></div>

                <div class="divider" style="padding: 10px 0px 15px 0px"><span>Objects</span></div>

                <div id="scene_objects"></div>

                <div class="divider" style="padding: 10px 0px 15px 0px"><span>Properties</span></div>

                <div id="scene_object_properties"></div>
              </div>

              <!-- Classification -->
              <h3 id="menu_classification"><span data-i18n="tb.classification_filter_opt"></span></h3>
              <div>
                <ul id="classificationList" class="pv-menu-list"></ul>
              </div>

              <!-- ABOUT -->
              <h3 id="menu_about"><span data-i18n="tb.about_opt"></span></h3>
              <div>
                <ul class="pv-menu-list">
                  <li><a href="http://potree.org" target="_blank">Potree</a> is a viewer for large point cloud / LIDAR
                    data sets, developed at the Vienna University of Technology.
                    <a href="https://github.com/potree/potree" target="_blank">(github)</a>
                  </li>
                  <li>Author: <a href="mailto:mschuetz@potree.org">Markus Sch&uuml;tz</a></li>
                  <li>License: <a target="_blank" href="http://potree.org/wp/potree_license/">FreeBSD (2-clause BSD)</a>
                  </li>
                  <li>Libraries:
                    <ul>
                      <li><a target="_blank" href="http://threejs.org/">three.js</a></li>
                      <li><a target="_blank" href="https://jquery.com/">Jquery</a></li>
                      <li><a target="_blank" href="http://www.laszip.org/">laszip</a></li>
                      <li><a target="_blank" href="https://github.com/verma/plasio">Plas.io (laslaz) </a></li>
                      <li><a target="_blank" href="http://openlayers.org/">OpenLayers3</a></li>
                      <li><a target="_blank" href="http://proj4js.org/">proj4js</a></li>
                      <li><a target="_blank" href="https://github.com/tweenjs/tween.js/">tween</a></li>
                      <li><a target="_blank" href="https://github.com/i18next/i18next/">i18next</a></li>
                    </ul>
                  </li>
                  <li>Donators:
                    <ul>
                      <li><a target="_blank" href="http://rapidlasso.com/">rapidlasso</a></li>
                      <li><a target="_blank" href="https://georepublic.info/en/">georepublic</a></li>
                      <li><a target="_blank" href="http://sitn.ne.ch/">sitn</a></li>
                      <li><a target="_blank" href="http://www.veesus.com/veesus/index.php">Veesus</a></li>
                      <li><a target="_blank" href="http://sigeom.ch/">sigeom sa</a></li>
                      <li><a target="_blank" href="http://archpro.lbg.ac.at/">LBI ArchPro</a></li>
                    </ul>
                  </li>
                  <li>Credits:
                    <ul>
                      <li><a target="_blank" href="https://www.cg.tuwien.ac.at/staff/MichaelWimmer.html">Michael
                        Wimmer</a> &
                        <a target="_blank" href="https://www.cg.tuwien.ac.at/staff/ClausScheiblauer.html">Claus
                          Scheiblauer</a></li>
                      <li><a target="_blank" href="https://www.cg.tuwien.ac.at/">TU Wien, Insitute of Computer Graphics
                        and Algorithms</a></li>
                      <li><a target="_blank" href="https://harvest4d.org/">Harvest4D</a></li>
                      <li><a target="_blank" href="http://rapidlasso.com/">rapidlasso</a></li>
                      <li><a target="_blank" href="https://georepublic.info/en/">georepublic</a></li>
                      <li><a target="_blank" href="http://hobu.co/">Howard Butler, Uday Verma, Connor Manning</a></li>
                      <li><a target="_blank" href="http://www.danielgm.net/cc/">Cloud Compare</a></li>
                      <li><a target="_blank" href="http://sitn.ne.ch/">sitn</a></li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <h1 style="color:red">3D 매핑과 3D Tile처리 문제해결해야 함. 1년(?)은 족히 걸릴 듯... T.T</h1> -->

    </v-content>
  </v-app>
</template>

<script>
  import VueScriptComponent from 'vue-script-component'

  // import Potree from '../../../static/Potree/build/potree/potree.js'
  // import Potree from './potree'
  import Constants from "@/components/common/constants"

  export default {
    components: {
      VueScriptComponent
    },
    data() {
      return {
        name: '3dmap',
        title: '3D Map....',
        drawer: true,
        isShowContainer: false,
        projectId: this.$route.params.projectId,
        taskId: this.$route.params.taskId,

        css: [
          {id: 'potreeCSS', url: '/static/Potree/build/potree/potree.css'},
          {id: 'jqueryUICSS', url: '/static/Potree/libs/jquery-ui/jquery-ui.min.css'},
          {id: 'perfectScollbarCSS', url: '/static/Potree/libs/perfect-scrollbar/css/perfect-scrollbar.css'},
          {id: 'openlayers3CSS', url: '/static/Potree/libs/openlayers3/ol.css'},
          {id: 'spectrumCSS', url: '/static/Potree/libs/spectrum/spectrum.css'},
          {id: 'jstreeCSS', url: '/static/Potree/libs/jstree/themes/mixed/style.css'},
        ],

        script: [
          {id: 'jquery', url: `/static/Potree/libs/jquery/jquery-3.1.1.min.js`},
          {id: 'spectrum', url: `/static/Potree/libs/spectrum/spectrum.js`},
          {id: 'perfectScrollbar', url: `/static/Potree/libs/perfect-scrollbar/js/perfect-scrollbar.jquery.js`},
          {id: 'jqueryUI', url: `/static/Potree/libs/jquery-ui/jquery-ui.min.js`},
          {id: 'three', url: `/static/Potree/libs/three.js/build/three.min.js`},
          {id: 'binaryHeap', url: `/static/Potree/libs/other/BinaryHeap.js`},
          {id: 'tween', url: `/static/Potree/libs/tween/tween.min.js`},
          {id: 'd3', url: `/static/Potree/libs/d3/d3.js`},
          {id: 'proj4', url: `/static/Potree/libs/proj4/proj4.js`},
          {id: 'openlayers3', url: `/static/Potree/libs/openlayers3/ol.js`},
          {id: 'i18next', url: `/static/Potree/libs/i18next/i18next.js`},
          {id: 'jstree', url: `/static/Potree/libs/jstree/jstree.js`},
          {id: 'potree', url: `/static/Potree/build/potree/potree.js`},
          {id: 'laslaz', url: `/static/Potree/libs/plasio/js/laslaz.js`},
        ]
      }
    },

    created() {
      this.items = [{
        title: this.$route.params.projectId,
        text: this.$route.params.taskId
      }];
      this.css.forEach((info) => {
        if (document.getElementById(info.id)) return

        const tag = document.createElement('link')
        tag.rel = 'stylesheet'
        tag.type = 'text/css'
        tag.href = info.url
        tag.id = info.id
        document.getElementsByTagName('head')[0].appendChild(tag)
      })
    },

    mounted() {
        this.init()
    },

    beforeDestroy() {
      this.css.forEach((info) => {
        const parent = document.getElementsByTagName('head')
        parent[0].removeChild(document.getElementById(info.id))
      })

      // this.isShowContainer = false
      viewer.renderer.forceContextLoss()
      // delete window.viewer
      // Potree.workerPool = new Potree.WorkerPool()
      // delete Potree.workerPool
      // console.log(Potree.workerPool)
      // delete Potree.PointCloudOctreeGeometry
    },

    methods: {
      async init() {
        // await this.loadHTMLTag()
        await this.initPotree()
      },
      loadHTMLTag() {
        console.log("start loadJS")
        this.css.forEach((info) => {
          if (document.getElementById(info.id)) return

          const tag = document.createElement('link')
          tag.rel = 'stylesheet'
          tag.type = 'text/css'
          tag.href = info.url
          tag.id = info.id
          document.getElementsByTagName('head')[0].appendChild(tag)
        })

        this.script.forEach((info) => {
          if (document.getElementById(info.id)) return

          const tag = document.createElement('script')
          tag.src = info.url
          tag.id = info.id
          document.getElementsByTagName('body')[0].appendChild(tag)
        })
        console.log("end loadJS")
      },

      initPotree() {
        console.log("start initPotree")
        const container = this.$refs.container
        // window.viewer = new Potree.Viewer(document.getElementById("potree_render_area"));
        try {
          window.viewer = new Potree.Viewer(container);
        } catch(e) {
          setTimeout(() => {
            console.log("retry..")
            this.initPotree()
          }, 500)
          return          
        }
        viewer.setEDLEnabled(true);
        viewer.setFOV(60);
        viewer.setPointBudget(1*1000*1000);
        viewer.setWeightClassification(1);
        viewer.setBackground("gradient"); // ["skybox", "gradient", "black", "white"];
        viewer.loadSettingsFromURL();

        viewer.loadGUI(() => {
          viewer.setLanguage('en');
          $("#menu_appearance").next().show();
          viewer.toggleSidebar();
        });

        // Lion
        const rootPath = `${Constants.API_SERVER}/api/projects/${this.projectId}/tasks/${this.taskId}/tms`
        let pointCloudPath = rootPath + '/assets/entwine_pointcloud/ept.json'
        console.log(this.projectId, this.taskId)

        // 파일이 없는 경우, Potree Library내에서 callback을 주지 않기때문에 어쩔수 없이 미리 체크...
        fetch(pointCloudPath)
          .then(response => response.text())
          .then(data => {
            console.log(data);
            // 개발모드(localhost)에서 호출하는 경우는 {"code":401,"message":"유효하지 않은 토큰입니다"} 리턴되는데.. 일단, 무시..
            var json = JSON.parse(data)
            if(json.detail == "Asset does not exist") {
              // 구버전 ODM에서 만들어진 pointcloud
              pointCloudPath = rootPath + '/assets/potree_pointcloud/cloud.js'
              fetch(pointCloudPath)
                .then(response => response.text())
                .then(data => {
                  console.log(data)
                  Potree.loadPointCloud(pointCloudPath, "", function (e) {
                    console.log(e)
                    viewer.scene.addPointCloud(e.pointcloud);
                    viewer.fitToScreen();
                  });
                })
            } else {
              Potree.loadPointCloud(pointCloudPath, "", function (e) {
                console.log(e)
                viewer.scene.addPointCloud(e.pointcloud);
      
                // let material = e.pointcloud.material;
                // material.size = 1;
                // material.pointSizeType = Potree.PointSizeType.ADAPTIVE;
      
                viewer.fitToScreen();
              });
            }
          });
        console.log(pointCloudPath)

        console.log("end initPotree")
      },
      goToPrevPage() {
        window.open('', '_self', '').close();
      },
    },
  }

</script>

<style>
  /*@import '../../../static/Potree/build/potree/potree.css';*/
  /*@import '../../../static/Potree/libs/jquery-ui/jquery-ui.min.css';*/
  /*@import '../../../static/Potree/libs/perfect-scrollbar/css/perfect-scrollbar.css';*/
  /*@import '../../../static/Potree/libs/openlayers3/ol.css';*/
  /*@import '../../../static/Potree/libs/spectrum/spectrum.css';*/
  /*@import '../../../static/Potree/libs/jstree/themes/mixed/style.css';*/

</style>
