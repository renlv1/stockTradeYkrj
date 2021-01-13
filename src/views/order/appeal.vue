<template>
  <div class="appeal">
    <div class="section">
      <div v-if="problem">
        <div class="cblue mb20" v-if="problem.replycontent && problem.problemStatus !== 2">{{$t('otcOrderDetail.text74')}}</div>
        <div class="section cblue mb20" v-if="problem.problemStatus === 2">
          <!--  申诉方赢   -->
          <template v-if="problem.backup2 === problem.userSystemCode">
            <i v-if="order.isBuy">{{$t('otcOrderDetail.text53')}}</i>
            <i v-else>{{$t('otcOrderDetail.text54')}}</i>
          </template>
          <!--  申诉方输   -->
          <template v-else>
            <i v-if="order.isBuy">{{$t('otcOrderDetail.text55')}}</i>
            <i v-else>{{$t('otcOrderDetail.text56')}}</i>
          </template>
        </div>
        <div class="mb20">
          <div class="win" v-if="problem.backup2 === problem.userSystemCode">{{$t('otcOrderDetail.text59')}}</div>
          <b class="fz15">
            {{$t('otcOrderDetail.text57', {name: problem.postNickName})}}
          </b>
        </div>
        <div>{{$t('otcOrderDetail.text58')}}
          <span>{{$t('otcOrderDetail.arr1')[problem.contentType - 1]}}</span>
        </div>
        <p style="padding-top: 4px;">{{problem.content}}</p>
        <!-- <div v-if="problem.contentimg" class="img-tips">图片附件</div> -->
        <div class="img-list">
          <ul>
            <li @click="showImg(imgItem.imageUrl)" v-for="(imgItem,index) in problem.contentimg && JSON.parse(problem.contentimg)" :key="index"><img :src="imgItem.imageUrl" alt=""></li>
          </ul>
        </div>
        <div v-if="problem.replycontent">
          <div class="text fz15" style="border-top: 1px solid #41414f;padding-top: 30px;margin-top:30px;">
            <div class="win" v-if="problem.backup2 === problem.replySystemCode">{{$t('otcOrderDetail.text59')}}</div>
            <!-- <b>{{problem.replyNickName}}</b>的申诉回复 -->
            <b>
              {{$t('otcOrderDetail.text60', {name: problem.replyNickName})}}
            </b>
          </div>
          <p>{{problem.replycontent}}</p>
          <!-- <div v-if="problem.replyimg" class="img-tips">图片附件</div> -->
          <div class="img-list">
            <ul>
              <li @click="showImg(imgItem.imageUrl)" v-for="(imgItem,index) in  problem.replyimg && JSON.parse(problem.replyimg)" :key="index"><img :src="imgItem.imageUrl" alt=""></li>
            </ul>
          </div>
          <!-- <div class="btn plain" v-if="problem.problemStatus !== 2">系统处理中</div> -->
          <div class="btn" v-if="problem.problemStatus !== 2 && user === problem.userSystemCode" @click="cancelAppeal">{{$t('otcOrderDetail.text61')}}</div>
        </div>
        <div v-if="!problem.replycontent && order.status !== 6">
          <div v-if="user === problem.userSystemCode">
            <div class="cbluem mb10">{{$t('otcOrderDetail.text62')}}</div>
            <p class="cdark">{{$t('otcOrderDetail.text63')}}</p>
            <div class="btn" @click="cancelAppeal">{{$t('otcOrderDetail.text61')}}</div>
          </div>
          <div v-else>
            <div class="cblue mb20" style="margin-top: 60px;line-height: 1.4;">{{$t('otcOrderDetail.text64')}}</div>
            <h4>{{$t('otcOrderDetail.text67')}}</h4>
            <div style="margin-top: 20px;">
              <el-input type="textarea" :placeholder="$t('otcOrderDetail.text65')" v-model="problemContent" :rows="3" :autosize="{minRows: 3, maxRows: 6}" maxlength="500" resize="none" show-word-limit></el-input>
            </div>
            <div class="upload" :class="{hide: imagesArr.length >= 5}">
              <el-upload
                :action="`${path}/upload/uploadimg`"
                list-type="picture-card"
                name="myfile"
                :limit="5"
                :data="{
                  sourceType: 1
                }"
                :on-exceed="() => $message.error($t('otcOrderDetail.text66'))"
                :on-success="getFileList"
                :on-remove="removeFileList"
                :on-preview="showImg"
                accept="image/*"
                with-credentials>
                <i class="el-icon-plus"></i>
              </el-upload>
            </div>
            <button class="btn mt60" @click="showReplyConfirm">{{$t('otcOrderDetail.text67')}}</button>
          </div>
        </div>
      </div>

      <div v-else>
        <el-select v-model="reason" style="width: 350px" :placeholder="$t('otcOrderDetail.text68')">
          <el-option v-for="(item, index) in reasonList" :key="index" :value="index" :label="item"></el-option>
        </el-select>
        <div style="margin-top: 20px;">
          <el-input type="textarea" :placeholder="$t('otcOrderDetail.text65')" v-model="problemContent" :rows="3" :autosize="{minRows: 3, maxRows: 6}" maxlength="500" resize="none" show-word-limit></el-input>
        </div>
        <div class="upload" :class="{hide: imagesArr.length >= 5}">
          <el-upload
            :action="`${path}/upload/uploadimg`"
            list-type="picture-card"
            name="myfile"
            :limit="5"
            :data="{
              sourceType: 1
            }"
            :on-success="getFileList"
            :on-remove="removeFileList"
            :on-preview="showImg"
            accept="image/*"
            :on-exceed="() => $message.error($t('otcOrderDetail.text66'))"
            with-credentials>
            <i class="el-icon-plus"></i>
          </el-upload>
        </div>
        <div class="btns">
          <button class="btn" @click="showConfirm">{{$t('otcOrderDetail.text69')}}</button>
          <button class="btn plain" @click="$parent.showAppeal = false">{{$t('otcOrderDetail.text61')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      descNum: 0,
      reason: '', // 申诉原因
      problemContent: '',
      imagesArr: [],
      bigImgSrc: '',
      showBigImg: false,
      path: process.env.VUE_APP_BASE_PATH,
      showAppeal: false,
      reasonList: this.$t('otcOrderDetail.arr1')
    };
  },
  props: {
    problem: [String, Object],
    order: [String, Object]
  },
  computed: {
    user () {
      return this.$store.state.user.userSystemCode
    }
  },
  methods: {
    showConfirm () {
      if (!this.problem && this.reason === '') {
        this.$message.error(this.$t('otcOrderDetail.text68'))
      } else if (!this.problemContent) {
        this.$message.error(this.$t('otcOrderDetail.text65'))
      } else {
        this.$confirm(this.$t('otcOrderDetail.text70')).then(() => {
          let params = {
            orderid: this.order.id, // 订单ID
            ordertype: this.order.buySystemCode ? 1 : 2, // 申诉来源，1.买入，2:卖出
            problemtype: this.problem ? this.problem.contentType : this.reason + 1, // 申诉类型，1.未收到款 2.金额与订单不符 3.恶意下单
            content: this.problemContent, // 申诉内容
            img: this.imagesArr.length ? JSON.stringify(this.imagesArr) : '', // 图片
            loading: true
          }
          // 如果是被申诉人还要传问题id
          if (this.problem.problemId) {
            params.problemId = this.problem.id // 问题ID
          }

          this.$fetch.post('/problem/createProblem', params).then(res => {
            this.cb(res)
          })
        })
      }
    },
    showReplyConfirm () {
      if (!this.problemContent) {
        this.$message.error(this.$t('otcOrderDetail.text65'))
      } else {
        this.$confirm(this.$t('otcOrderDetail.text70')).then(() => {
          this.$fetch.post('/problem/replyProblem', {
            problemid: this.problem.id,
            replyimg: this.imagesArr.length ? JSON.stringify(this.imagesArr) : '', // 图片,
            replycontent: this.problemContent, // 申诉内容
            loading: true
          }).then(res => {
            this.cb(res)
          })
        })
      }
    },
    cb (res) {
      if (res.success) {
        this.$parent.getData()
      } else {
        this.$message.error(res.msg)
      }
    },
    cancelAppeal () {
      this.$confirm(this.$t('otcOrderDetail.text71')).then(() => {
        this.$fetch.post('/problem/cancelProblem', {
          problemid: this.problem.id,
          loading: true
        }).then(() => {
          this.$message.success(this.$t('otcOrderDetail.text72'))
          this.$parent.showAppeal = false
          this.$parent.getData()
        })
      })
    },
    // 输入文字控制
    textareaVal () {
      this.descNum = this.problemContent.length
      this.noneContent = ''
      if (this.problemContent.length > 500) {
        this.descNum = 500
        this.problemContent = this.problemContent.substring(0, 500)
      }
    },
    getFileList (res, file, fileList) {
      this.transfterData(fileList)
    },
    removeFileList (file, fileList) {
      this.transfterData(fileList)
    },
    transfterData (fileList) {
      this.imagesArr = []
      fileList.forEach(item => {
        this.imagesArr.push({
          imageUrl: item.response.data[0].fileName
        })
      })
    },
    showImg (src) {
      let url
      if (typeof src === 'string') {
        url = src
      } else {
        url = src.url
      }
      this.$previewImg(url)
    }
  }
};
</script>

<style lang="less" scoped>
.appeal{
  &-radio{
    padding-top: 20px;
  }
}
.img-tips{
  margin-bottom: -10px;
  font-size: 13px;
}
.text-box{
  position: relative;
  padding-top: 20px;
  width: 380px;
  .textarea{
    width: 100%;
    line-height: 1.3;
    height: 150px;
    border-radius: 4px;
    font-size: 16px;
    padding: 10px 20px;
    font-family: Arial;
    box-sizing: border-box;
    border: 1px solid @bc;
    resize: none;
  }
  .warm-num{
    font-size: 16px;
    color: #999;
    position: absolute;
    z-index: 30;
    right: 14px;
    bottom: 14px;
  }
}
.text{
  margin-bottom: 24px;
}
.radio-text{
  font-size: 16px;
  margin-left: 10px;
}
.img-list{
  margin: 20px 0;
  ul{
    display: flex;
  }
  li{
    border: 1px solid #384d9a;
    border-radius: 4px;
    overflow: hidden;
  }
  li + li{
    margin-left: 20px;
  }
  img{
    width: 98px;
    height: 98px;
    object-fit: cover;
  }
  @media @mob{
    img{
      width: 55px;
      height: 55px;
    }
  }
}
.view-big{
  font-size: 14px;
  opacity: .8;
}
.appeal-deatil{
  line-height: 1.4;
  font-size: 15px;
  color: #777;
}
.btns{
  margin-top: 40px;
  display: flex;
  .btn{
    margin-top: 0;
    margin-right: 40px;
  }
}
.win{
  border: 1px solid @green;
  color: @green;
  padding: 3px 7px;
  border-radius: 2px;
  display: inline-block;
  vertical-align: 1px;
  line-height: 1;
  font-size: 12px;
  margin-right: 6px;
}
</style>

<style>
.appeal-radio label{
  margin-bottom: 10px;
}
.upload.hide .el-upload{
  display: none;
}
</style>
