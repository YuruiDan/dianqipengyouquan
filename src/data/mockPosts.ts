import type { Post } from '../types/models'
import { baseMockPosts } from '../content/posts/basePosts'
import { longPostSpecs } from '../content/posts/longPostSpecs'

const countChineseChars = (value: string): number =>
  (value.match(/[\u4e00-\u9fff]/g) ?? []).length

const countParagraphs = (value: string): number =>
  value
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean).length

const getSeedParagraphs = (value: string): [string, string] => {
  const chunks = value
    .split(/\n\s*\n/)
    .map((item) => item.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  if (chunks.length === 0) {
    return [
      '这条动态最初来自一线观察，但它背后很快暴露出可以系统化研究的核心问题。',
      '随着重复实验与对照记录增多，关键现象呈现出稳定可复现的规律。',
    ]
  }

  if (chunks.length === 1) {
    return [chunks[0], chunks[0]]
  }

  return [chunks[0], chunks[1]]
}

const buildLongContent = (post: Post): string => {
  const spec = longPostSpecs[post.id]
  if (!spec) {
    return post.content
  }

  const [seedA, seedB] = getSeedParagraphs(post.content)

  const paragraphs = [
    `把时间放回${post.yearLabel}年前后，${post.authorName}面对的并不只是单一实验现象，而是整个电气认知体系尚未成形的时代处境。${spec.background}。在那个阶段，研究工具、测量标准与理论语言都还在快速变化，很多判断只能依靠反复实验和跨场景对照来慢慢确立。也正因如此，每一次记录都不只是“结果展示”，更是后来工程规范的雏形。`,
    `真正棘手的问题在于${spec.problem}。如果这个关节无法打通，后续技术就会长期停留在“偶然有效”，很难进入可复制、可迭代、可规模化部署的工程状态。对于当时的研究者来说，任务已经不仅是描述一个新奇现象，而是要回答它在什么条件下成立、边界在哪里、能否被普遍复现，这决定了它究竟是历史趣闻还是可落地技术。`,
    `围绕这个难题，${post.authorName}并没有急于给出结论，而是先重构了研究路径。${spec.thinking}。这类思考方式的价值在于把“直觉”转成“可验证假设”，再把假设转成“可操作变量”。当问题能够以变量关系表达时，后续实验就不再是盲试，而是带着明确判据向前推进，这也是科学研究与工程开发能够衔接的关键。`,
    `在实际推进中，研究通常经历了多轮验证与反证。${spec.process}。${seedA}。这些尝试并不追求一次命中，而是强调每一步都可追溯：先控制条件，再记录差异，然后根据差异反推模型是否成立。正是这种“观察—调整—再观察”的节奏，让研究从个体经验逐渐沉淀成可共享的方法。`,
    `随着记录累积，最关键的现象开始稳定显现：${spec.phenomenon}。${seedB}。这一阶段最重要的意义，不在于“现象本身足够惊人”，而在于它出现了可量化的趋势和可验证的方向性。只要具备这种稳定关系，研究就能从定性描述迈入定量分析，为后续公式化表达与工程设计打开通路。`,
    `为了把实验认知转成可计算语言，研究中自然会引入关系式。这里可以用这样的写法来表达：${spec.formula}。这个式子并不是孤立的符号展示，而是把实验里反复出现的变量关系压缩成一条可复用规则。通过它，研究者可以在不同场景下进行同尺度比较，也能让不同团队在同一技术语义下对齐设计决策。`,
    `公式写出来之后，更关键的是理解它背后的物理含义与约束边界。${spec.formulaExplain}。这一步把“符号关系”重新拉回到“工程含义”：变量怎么变，系统会如何响应；参数为什么敏感，风险会在哪里出现。只有公式前有可观察事实、公式中有明确变量、公式后有可验证解释，数学表达才真正具备工程价值。`,
    `当上述关系进入工程实践，它的价值会被迅速放大。${spec.engineering}。工程团队可以据此开展参数选型、容差评估、失效防护与运维策略设计，把技术从“能工作”推进到“长期稳定工作”。很多看似成熟的系统能力，实际上都来自这一步把理论关系转译成工程规则的过程。`,
    `放在更长的技术链路上看，这项成果影响的从来不止一个器件或单点场景。${spec.impact}。因此这条动态记录的，是电气工程方法论的一次升级：人们不再满足于讲述现象，而是开始用可验证叙事与可计算关系组织知识、连接实验与系统、连接发明与产业。这也正是现代电气工程能够持续演进的根基。`,
  ]

  let content = paragraphs.join('\n\n')
  const filler =
    '在后续复核中，这一规律在不同实验边界下仍保持一致趋势，进一步证明它既有理论解释力，也具备跨场景工程可迁移性。'

  while (countChineseChars(content) < 900) {
    content = `${content}\n\n${filler}`
  }

  while (countParagraphs(content) < 7) {
    content = `${content}\n\n${filler}`
  }

  return content
}

const buildSummary = (content: string): string => {
  const firstParagraph = content
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .find((item) => item.length > 0)

  if (!firstParagraph) {
    return ''
  }

  return firstParagraph.length > 180 ? `${firstParagraph.slice(0, 180)}...` : firstParagraph
}

export const mockPosts: Post[] = baseMockPosts.map((post) => {
  const content = buildLongContent(post)
  return {
    ...post,
    content,
    summary: buildSummary(content),
  }
})
