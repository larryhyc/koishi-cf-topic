import { console } from 'inspector'
import { Context, Schema } from 'koishi'

export const name = 'cf-topic'

export interface Config { }

export const Config: Schema<Config> = Schema.object({})

export function apply(ctx: Context) {
  // write your plugin here
   let tags = ['2-SAT','2-sat','binary search', 'bitmasks', 'brute force', 'chinese remainder theorem', 'combinatorics',
                  'constructive algorithms', 'data structures', 'dfs and similar', 'divide and conquer', 'dp', 'dsu',
                  'expression parsing', 'fft', 'flows', 'games', 'geometry', 'graph matchings', 'graphs', 'greedy',
                  'hashing', 'implementation', 'interactive', 'math', 'matrices', 'meet-in-the-middle', 'number theory',
                  'probabilities', 'schedules', 'shortest paths', 'sortings', 'string suffix structures', 'strings',
                  'ternary search', 'trees', 'two pointers',
  ]
  let tags_CN = ['2-SAT','2-sat','二分', '状态压缩', '暴力枚举', '中国剩余定理', '组合数学',
                  '构造', '数据结构', 'DFS及其变种', '分治', '动态规划', '并查集',
                  '表达式解析', '快速傅里叶变换', '流', '博弈论', '计算几何', '图匹配', '图论', '贪心',
                  '哈希表', '模拟', '交互题', '数学', '矩阵', '双向搜索', '数论',
                  '概率论', '调度算法','最短路', '排序', '字符串后缀结构', '字符串处理',
                  '三分', '树形结构', '双指针',
  ]



  ctx.command('topic <tag:string> <score:number>','输入topic 标签 分数 获取cf相关题目')
    .action((_, tag, score) => {

      // 双向映射
      const tagMapping = {};
      tags.forEach((tag, index) => {
        tagMapping[tag] = tags_CN[index]
        tagMapping[tags_CN[index]] = tag
      });


      if (score < 800 || score > 3500 || score % 100 != 0) {
        return '分数必须是 800 到 3500 之间的整百数！'
      }

      if (!tagMapping[tag]) {
        return `${tag} 标签不存在，请使用以下标签之一：\n` + tags.join(',') + '\n' + tags_CN.join(',')
      }

      // 发送请求，然后筛选对应分数的题目拼接好url

      try {
        async function getData(url) {
          const response = await fetch(url)
          const data = await response.json()
          // console.log(data)
          const problems = data.result.problems
          // 获取到数据下面rating 等于 score 的题目
          const targetProblems = problems.filter(problem => problem.rating === score)
          // 随机选取一个题目，然后返回拼接的url
          // console.log(targetProblems)
          const randomProblem = targetProblems[Math.floor(Math.random() * targetProblems.length)]
          return `https://codeforces.com/problemset/problem/${randomProblem.contestId}/${randomProblem.index}`
        }
        

          
          // console.log(tags[tags_CN.indexOf(tag)])
          // 如果输入的是中文映射表的标签，就换为英文标签
          if (tags_CN.indexOf(tag) !== -1) {
            const url = `https://codeforces.com/api/problemset.problems?tags=${tags[tags_CN.indexOf(tag)]}`
            getData(url)
          } else {
            // 如果输入是英文映射表的tag，直接拼接字符串并调用函数
            const url = `https://codeforces.com/api/problemset.problems?tags=${tag}`
            getData(url)
          }
        
      } catch (e) {
        console.log(e)
        return '发生了错误:\n' + e
      }
  })
}
