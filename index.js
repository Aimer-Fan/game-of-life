// 根据一个二维数组渲染结果
function drawPanel (data) {
  // 先准备一个文档碎片
  const fragment = document.createDocumentFragment()
  const table = document.createElement('table')
  table.setAttribute('border', '1')
  table.setAttribute('cellpadding', '0')
  table.setAttribute('cellspacing', '0')

  fragment.appendChild(table)

  // 根据数据逐行逐列的生成标签
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    const tr = document.createElement('tr')
    table.appendChild(tr)
    for (let j = 0; j < row.length; j++) {
      const cur = row[j]
      const td = document.createElement('td')
      td.setAttribute('class', cur ? 'black' : 'white')
      td.setAttribute('data-row', i)
      td.setAttribute('data-col', j)
      td.addEventListener('click', handleClickTd)
      tr.appendChild(td)
    }
  }

  // 将文档碎片放到指定的位置
  const pane = document.getElementById('pane')
  pane.innerHTML = ''
  pane.appendChild(table)
}

// 随机生成 n*n 的二维数组
function generateData (n, flag) {
  const result = new Array(n)
  for (let i = 0; i < n; i++) {
    result[i] = new Array(n)
    const row = result[i]
    for (let j = 0; j < n; j++) {
      row[j] = flag === undefined ? Math.random() > 0.5 : flag
    }
  }
  return result
}

let animationId
function step (nowData, nextData) {
  drawPanel(nowData)
  getNextData(nowData, nextData)
  const temp = nowData
  nowData = nextData
  nextData = temp

  animationId = requestAnimationFrame(() => step(nowData, nextData))
}


// 获取下一帧的数据
function getNextData (source, target) {
  for (let i = 0; i < target.length; i++) {
    for (let j = 0; j < target[i].length; j++) {
      target[i][j] = this.compute(source, i, j)
    }
  }
}

function compute (tableData, x, y) {
  let count = 0
  const row = tableData.length-1
  const col = tableData[0].length-1
  
  if (x-1 >=0 && y-1 >=0 && tableData[x-1][y-1]) {
    count++
  }
  if (y-1 >=0 && tableData[x][y-1]) {
    count++
  }
  if (x+1 <= col && y-1 >=0 && tableData[x+1][y-1]) {
    count++
  }
  if (x-1 >=0 && tableData[x-1][y]) {
    count++
  }
  if (x+1 <= col && tableData[x+1][y]) {
    count++
  }
  if (x-1 >= 0 && y+1 <= row && tableData[x-1][y+1]) {
    count++
  }
  if (y+1 <= row && tableData[x][y+1]) {
    count++
  }
  if (x+1 <= col && y+1 <= row && tableData[x+1][y+1]) {
    count++
  }
  
  if (count === 3) {
    return true
  } else if (count === 2) {
    return tableData[x][y]
  } else {
    return false
  }
  
}

var SIZE = 50
var nowData = generateData(SIZE)
var nextData = generateData(SIZE)
var isEdit = false
getNextData(nowData, nextData)
drawPanel(nowData)

/* 事件监听 */
function run () {
  isEdit = false
  step(nowData, nextData)
}
function stop () {
  isEdit = false
  cancelAnimationFrame(animationId)
}
function nextStep () {
  isEdit = false
  drawPanel(nowData)
  getNextData(nowData, nextData)
  const temp = nowData
  nowData = nextData
  nextData = temp
}
function edit () {
  isEdit = true
  nowData = generateData(SIZE, false)
  drawPanel(nowData)
}
function handleClickTd (e) {
  if (!isEdit) return
  let row = e.target.getAttribute('data-row')
  let col = e.target.getAttribute('data-col')
  row = parseInt(row)
  col = parseInt(col)
  nowData[row][col] = !nowData[row][col]

  drawPanel(nowData)
}