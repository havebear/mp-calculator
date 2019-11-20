//index.js

import mathjs from '../../lib/math.min.js'

// 运算符集合
const OPERATORS = '+-*/'

Page({
  data: {
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
    // 计算
    let expression = this.data.expression
    // 取最后一位，判断是否为符号，是的话则去掉符号
    const lastStr = expression[expression.length - 1]
    if (lastStr && OPERATORS.indexOf(lastStr) !== -1) {
      expression = expression.substring(0, expression.length - 1)
    }
    this.setData({ result: mathjs.eval(expression)})
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
  }
})
