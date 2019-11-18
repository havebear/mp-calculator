//index.js

// 运算符集合
const OPERATORS = '+-*/'

Page({
  data: {
    //运算参数1
    calInput1:'',  
    //运算参数2
    calInput2:'',
    //运算符号
    calSign:'',
    //历史输入（框1）
    history:'',
    //运算结果（框2）
    result:'',
    //临时数
    tempNum:'',
    //临时运算符
    tempSign:'',

    // 表达式
    expression: '',
    // 结果
    result: 0,
    // 键盘格子
    grids: [
      {
        label: '7',
        type: 0
      },
      {
        label: '8',
        type: 0
      },
      {
        label: '9',
        type: 0
      },
      {
        label: '/',
        type: 1
      },
      {
        label: '4',
        type: 0
      },
      {
        label: '5',
        type: 0
      },
      {
        label: '6',
        type: 0
      },
      {
        label: '*',
        type: 1
      },
      {
        label: '1',
        type: 0
      },
      {
        label: '2',
        type: 0
      },
      {
        label: '3',
        type: 0
      },
      {
        label: '-',
        type: 1
      },
      {
        label: '0',
        type: 0
      },
      {
        label: '.',
        type: 2
      },
      {
        label: '+',
        type: 1
      },
      {
        label: 'C',
        type: 3
      }
    ]
  },

  // 点击键盘格子
  handleGridClick (e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.grids[index]
    switch (item.type) {
      case 0:
        this.setExpression(item.label)
        break
      case 1:
        this.inputOperator(item.label)
        break
      case 2:
        this.inputPoint(item.label)
        break
      case 3:
        this.setExpression('', false)
        break
    }
  },

  // 设置表达式
  setExpression (value = '', isAdd = true) {
    let expression = this.data.expression
    expression += value
    if (!isAdd) {
      // 当表达式长度为0
      if (!expression.length) return
      // 删除最后一位
      expression = expression.substring(0, expression.length - 1)
    }
    this.setData({ expression })
  },

  // 输入点
  inputPoint (value) {
    let expression = this.data.expression
    const lastStr = expression[expression.length - 1]
    // 匹配当前表达式中（加入临时小数点）是否存在拥有两位小数点的数字
    if (/[0-9]*\.[0-9]*\.[0-9]*/.test(expression + '.')) {
      return
    }
    // 前面一位不是数字时，补充0
    if (!(/^[0-9]+$/.test(lastStr))) {
      expression += `0`
    }
    expression += value
    this.setData({ expression })
  },

  // 输入运算符
  inputOperator (value) {
    let expression = this.data.expression
    // 当前表达式为空，禁止输入运算符
    if (!expression) return
    // 判断当前表达式最后一位是否为运算符,是则替换
    if (expression.length) {
      const lastStr = expression[expression.length - 1]
      if (OPERATORS.indexOf(lastStr) !== -1) {
        expression = expression.substring(0, expression.length - 1)
      }
    }
    expression += value
    this.setData({ expression })
  },

  //输入为小数点时的处理
  inputpoint: function (e) {
    //最后输入的值
    var historyLast = '';
    if(this.data.history != ''){
      historyLast = this.data.history.charAt(this.data.history.length - 1);
      //历史输入不为空且前一位输入是数字
      if (/^[0-9]+$/.test(historyLast)) {
        console.log("输入小数点");
        //追加history
        this.setData({ 
          history: this.data.history + '.',
          tempNum: this.data.tempNum + '.'});
      }
    }
  },


  //输入为数字时的处理
  inputnum: function (e) {
    //读最新输入的数字
    var num = e.currentTarget.dataset.num;
    
    //如果输入完等号后，直接再次输入数字，清空所有状态，当作第一次输入
    if(this.data.history == '' && this.data.calInput1 != ''){
      this.setData({
        result:'',
        calInput1:'',
        calSign:'',
        tempSign:'',
      });
    }
    //if当前数字=0&history=0，不做处理  
    // if((num=='0') && history=='')不处理
    if ((num != '0') || this.data.history != '') {
      //history追加
      this.data.history += num;
      this.setData({ history: this.data.history });
      //tempNum追加
    this.data.tempNum += num;
    this.setData({ tempNum: this.data.tempNum });
     }
    
  },

  //输入为等号时的处理
  inputequal:function(e){
    //连续输入等号不做任何处理
    if(this.data.tempSign != '=' && this.data.calInput1 != ''){
      //获得当前输入值
      this.setData({ tempSign: '=' });
      //截取最后一个字符的值
      var historyLast = this.data.history.charAt(this.data.history.length - 1);
      
      //上一个为运算符
      if (historyLast == '+' || historyLast == '-' ||
        historyLast == '*' || historyLast == '/') {
        //前一个运算符和等号连续使用，如+=计算，c1赋值给c2开始计算
        if (this.data.calInput1 != '') {
          this.setData({ calInput2: this.data.calInput1 });
          console.log("c2与c1值相同");
          this.cal(e);
        }
      }//上一个输入为小数点，先去掉小数点
      else if (historyLast == '.'){
        this.setData({ history: this.data.history.substring(0, this.data.history.length - 1) });
        this.ready(e);
      }
      //上一个输入为数字
      else {
        this.ready(e);
      }
    }
  },

  //输入为运算符时的处理
  inputsign: function (e) {
    //运算符不成为history首个输入
    if(this.data.calInput1 != '' || this.data.history != '' ){
      //获得当前输入值
      var sign = e.currentTarget.dataset.sign;
      this.setData({ tempSign: sign });
      //截取最后一个字符的值
      var historyLast = '';
      if (this.data.history != '') {
        historyLast = this.data.history.charAt(this.data.history.length - 1);
      } else {
        this.setData({ history: this.data.result });
      }

      //上一个输入字符为小数点，先去掉小数点
      if (historyLast == '.') {
        this.setData({
          history: this.data.history.substring(0, this.data.history.length - 1),
          tempNum: this.data.tempNum.substring(0, this.data.tempNum.length - 1)
        });
        this.ready(e);
      }//上一个输入字符是运算符，消去再追加history
      else if (historyLast == '+' || historyLast == '-' ||
        historyLast == '*' || historyLast == '/') {

        console.log("连续运算符，消除上一个");
        this.setData({ history: this.data.history.substring(0, this.data.history.length - 1) });
      } else if (historyLast != '') {
        //调用赋值及运算函数
        this.ready(e);
      }

      //history追加
      this.data.history += sign;
      this.setData({ history: this.data.history });
      //运算符变为最新的
      this.setData({ calSign: sign });
      console.log("运算符为" + sign);
    }
    
  },

  //运算前赋值函数
  ready:function(e){
    //tempNum
    if (this.data.calInput1 == '') {
      //如果c1为空，赋值给c1
      this.setData({ calInput1: this.data.tempNum });
      console.log("c1原为空，现为" + this.data.calInput1);
    } else if (this.data.calInput2 == '') {
      this.setData({ calInput2: this.data.tempNum });
      console.log("c2原为空，现为" + this.data.calInput2);
      //c1.c2都不为空，开始运算
      this.cal(e);
    }
    //tempNum赋值后清零
    this.setData({ tempNum: '' });
  },

  //运算函数
  cal: function (e) {
    //如果c1.c2非数字类型，先转换类型使加法成功
    if(typeof this.data.calInput1 =='string'){
      if (this.data.calInput1.indexOf('.') != -1) {
        this.setData({ calInput1: parseFloat(this.data.calInput1) });
      } else {
        this.setData({ calInput1: parseInt(this.data.calInput1) });
      }
    }
    
    if (typeof this.data.calInput2 == 'string') {
      if (this.data.calInput2.indexOf('.') != -1) {
        this.setData({ calInput2: parseFloat(this.data.calInput2) });
      } else {
        this.setData({ calInput2: parseInt(this.data.calInput2) });
      }
    }

    if(this.data.calSign=='+'){
      var res = this.data.calInput1 + this.data.calInput2;  
    }
    if (this.data.calSign == '-') {
      var res = this.data.calInput1 - this.data.calInput2;
    }
    if (this.data.calSign == '*') {
      var res = this.data.calInput1 * this.data.calInput2;
    }
    if (this.data.calSign == '/') {
      var res = this.data.calInput1 / this.data.calInput2;
    }
    console.log('阶段运算结果为' + res);
    //当前输入为等号
    if(this.data.tempSign =='='){
      this.setData({ history: '',}); 
    }
    this.setData({
      result: res,
      calInput1: res,
      calInput2: ''
    })

    console.log('运算后c1为' + this.data.calInput1);
    console.log("运算后c2为" + this.data.calInput2);
  }
})
