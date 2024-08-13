import{j as W,B as N,F as re,I as oe,k as q,l as k,m as $,f as J,n as se,o as ae,p as le,q as de,r as ce,g as fe,s as ue,t as pe,u as me,v as he,w as ve}from"./three-DLf2F1tq.js";const l=window.THREE?window.THREE:{Box3:W,BufferGeometry:N,Float32BufferAttribute:re,InstancedBufferGeometry:oe,InstancedInterleavedBuffer:q,InterleavedBufferAttribute:k,Sphere:$,Vector3:J,WireframeGeometry:se};var E=new l.BufferGeometry().setAttribute?"setAttribute":"addAttribute";const R=new l.Box3,B=new l.Vector3;class T extends l.InstancedBufferGeometry{constructor(){super(),this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this[E]("position",new l.Float32BufferAttribute(e,3)),this[E]("uv",new l.Float32BufferAttribute(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new l.InstancedInterleavedBuffer(t,6,1);return this[E]("instanceStart",new l.InterleavedBufferAttribute(i,3,0)),this[E]("instanceEnd",new l.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const i=new l.InstancedInterleavedBuffer(t,6,1);return this[E]("instanceColorStart",new l.InterleavedBufferAttribute(i,3,0)),this[E]("instanceColorEnd",new l.InterleavedBufferAttribute(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new l.WireframeGeometry(e.geometry)),this}fromLineSegments(e){const t=e.geometry;if(t.isGeometry){console.error("LineSegmentsGeometry no longer supports Geometry. Use THREE.BufferGeometry instead.");return}else t.isBufferGeometry&&this.setPositions(t.attributes.position.array);return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new l.Box3);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),R.setFromBufferAttribute(t),this.boundingBox.union(R))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new l.Sphere),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let o=0,u=e.count;o<u;o++)B.fromBufferAttribute(e,o),n=Math.max(n,i.distanceToSquared(B)),B.fromBufferAttribute(t,o),n=Math.max(n,i.distanceToSquared(B));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}T.prototype.isLineSegmentsGeometry=!0;const f=window.THREE?window.THREE:{ShaderLib:ae,ShaderMaterial:le,UniformsLib:de,UniformsUtils:ce,Vector2:fe};f.UniformsLib.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new f.Vector2(1,1)},dashScale:{value:1},dashSize:{value:1},dashOffset:{value:0},gapSize:{value:1}};f.ShaderLib.line={uniforms:f.UniformsUtils.merge([f.UniformsLib.common,f.UniformsLib.fog,f.UniformsLib.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		varying vec2 vUv;
		varying vec4 worldPos;
		varying vec3 worldStart;
		varying vec3 worldEnd;

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;

			#endif

			float aspect = resolution.x / resolution.y;

			vUv = uv;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			worldStart = start.xyz;
			worldEnd = end.xyz;

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				// get the offset direction as perpendicular to the view vector
				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 offset;
				if ( position.y < 0.5 ) {

					offset = normalize( cross( start.xyz, worldDir ) );

				} else {

					offset = normalize( cross( end.xyz, worldDir ) );

				}

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// extend the line bounds to encompass  endcaps
					start.xyz += - worldDir * linewidth * 0.5;
					end.xyz += worldDir * linewidth * 0.5;

					// shift the position of the quad so it hugs the forward edge of the line
					offset.xy -= dir * forwardOffset;
					offset.z += 0.5;

				#endif

				// endcaps
				if ( position.y > 1.0 || position.y < 0.0 ) {

					offset.xy += dir * 2.0 * forwardOffset;

				}

				// adjust for linewidth
				offset *= linewidth * 0.5;

				// set the world position
				worldPos = ( position.y < 0.5 ) ? start : end;
				worldPos.xyz += offset;

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segements overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

			vec2 offset = vec2( dir.y, - dir.x );
			// undo aspect ratio adjustment
			dir.x /= aspect;
			offset.x /= aspect;

			// sign flip
			if ( position.x < 0.0 ) offset *= - 1.0;

			// endcaps
			if ( position.y < 0.0 ) {

				offset += - dir;

			} else if ( position.y > 1.0 ) {

				offset += dir;

			}

			// adjust for linewidth
			offset *= linewidth;

			// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
			offset /= resolution.y;

			// select end
			vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

			// back to clip space
			offset *= clip.w;

			clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;
		varying vec4 worldPos;
		varying vec3 worldStart;
		varying vec3 worldEnd;

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		varying vec2 vUv;

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

			#endif

			#else

				#ifdef ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

			if ( abs( vUv.y ) > 1.0 ) {

				float a = vUv.x;
				float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
				float len2 = a * a + b * b;

				if ( len2 > 1.0 ) discard;

			}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class D extends f.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:f.UniformsUtils.clone(f.ShaderLib.line.uniforms),vertexShader:f.ShaderLib.line.vertexShader,fragmentShader:f.ShaderLib.line.fragmentShader,clipping:!0}),Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}D.prototype.isLineMaterial=!0;const r=window.THREE?window.THREE:{Box3:W,BufferGeometry:N,InstancedInterleavedBuffer:q,InterleavedBufferAttribute:k,Line3:ue,MathUtils:pe,Matrix4:me,Mesh:he,Sphere:$,Vector3:J,Vector4:ve};var C=new r.BufferGeometry().setAttribute?"setAttribute":"addAttribute";const V=new r.Vector3,j=new r.Vector3,s=new r.Vector4,a=new r.Vector4,m=new r.Vector4,M=new r.Vector3,U=new r.Matrix4,c=new r.Line3,F=new r.Vector3,v=new r.Box3,A=new r.Sphere,h=new r.Vector4;class X extends r.Mesh{constructor(e=new T,t=new D({color:Math.random()*16777215})){super(e,t),this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let u=0,d=0,p=t.count;u<p;u++,d+=2)V.fromBufferAttribute(t,u),j.fromBufferAttribute(i,u),n[d]=d===0?0:n[d-1],n[d+1]=n[d]+V.distanceTo(j);const o=new r.InstancedInterleavedBuffer(n,2,1);return e[C]("instanceDistanceStart",new r.InterleavedBufferAttribute(o,1,0)),e[C]("instanceDistanceEnd",new r.InterleavedBufferAttribute(o,1,1)),this}raycast(e,t){e.camera===null&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2.');const i=e.params.Line2!==void 0&&e.params.Line2.threshold||0,n=e.ray,o=e.camera,u=o.projectionMatrix,d=this.matrixWorld,p=this.geometry,G=this.material,y=G.resolution,z=G.linewidth+i,L=p.attributes.instanceStart,O=p.attributes.instanceEnd,w=-o.near,I=2*Math.max(z/y.width,z/y.height);p.boundingSphere===null&&p.computeBoundingSphere(),A.copy(p.boundingSphere).applyMatrix4(d);const Q=Math.max(o.near,A.distanceToPoint(n.origin));h.set(0,0,-Q,1).applyMatrix4(o.projectionMatrix),h.multiplyScalar(1/h.w),h.applyMatrix4(o.projectionMatrixInverse);const Y=Math.abs(I/h.w)*.5;if(A.radius+=Y,e.ray.intersectsSphere(A)===!1)return;p.boundingBox===null&&p.computeBoundingBox(),v.copy(p.boundingBox).applyMatrix4(d);const Z=Math.max(o.near,v.distanceToPoint(n.origin));h.set(0,0,-Z,1).applyMatrix4(o.projectionMatrix),h.multiplyScalar(1/h.w),h.applyMatrix4(o.projectionMatrixInverse);const S=Math.abs(I/h.w)*.5;if(v.max.x+=S,v.max.y+=S,v.max.z+=S,v.min.x-=S,v.min.y-=S,v.min.z-=S,e.ray.intersectsBox(v)!==!1){n.at(1,m),m.w=1,m.applyMatrix4(o.matrixWorldInverse),m.applyMatrix4(u),m.multiplyScalar(1/m.w),m.x*=y.x/2,m.y*=y.y/2,m.z=0,M.copy(m),U.multiplyMatrices(o.matrixWorldInverse,d);for(let g=0,te=L.count;g<te;g++){s.fromBufferAttribute(L,g),a.fromBufferAttribute(O,g),s.w=1,a.w=1,s.applyMatrix4(U),a.applyMatrix4(U);var ee=s.z>w&&a.z>w;if(ee)continue;if(s.z>w){const b=s.z-a.z,x=(s.z-w)/b;s.lerp(a,x)}else if(a.z>w){const b=a.z-s.z,x=(a.z-w)/b;a.lerp(s,x)}s.applyMatrix4(u),a.applyMatrix4(u),s.multiplyScalar(1/s.w),a.multiplyScalar(1/a.w),s.x*=y.x/2,s.y*=y.y/2,a.x*=y.x/2,a.y*=y.y/2,c.start.copy(s),c.start.z=0,c.end.copy(a),c.end.z=0;const P=c.closestPointToPointParameter(M,!0);c.at(P,F);const H=r.MathUtils.lerp(s.z,a.z,P),ne=H>=-1&&H<=1,ie=M.distanceTo(F)<z*.5;if(ne&&ie){c.start.fromBufferAttribute(L,g),c.end.fromBufferAttribute(O,g),c.start.applyMatrix4(d),c.end.applyMatrix4(d);const b=new r.Vector3,x=new r.Vector3;n.distanceSqToSegment(c.start,c.end,x,b),t.push({point:x,pointOnLine:b,distance:n.origin.distanceTo(x),object:this,face:null,faceIndex:g,uv:null,uv2:null})}}}}}X.prototype.LineSegments2=!0;class K extends T{constructor(){super(),this.type="LineGeometry"}setPositions(e){for(var t=e.length-3,i=new Float32Array(2*t),n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e){for(var t=e.length-3,i=new Float32Array(2*t),n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setColors(i),this}fromLine(e){var t=e.geometry;if(t.isGeometry){console.error("THREE.LineGeometry no longer supports Geometry. Use THREE.BufferGeometry instead.");return}else t.isBufferGeometry&&this.setPositions(t.attributes.position.array);return this}}K.prototype.isLineGeometry=!0;class ye extends X{constructor(e=new K,t=new D({color:Math.random()*16777215})){super(e,t),this.type="Line2"}}ye.prototype.isLine2=!0;export{ye as L,K as a,D as b};
