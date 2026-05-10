<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #not-found>
      <main class="zz-not-found" aria-labelledby="zz-not-found-title">
        <p class="zz-not-found__code">
          404
        </p>
        <h1 id="zz-not-found-title">
          山河无此卷
        </h1>
        <p class="zz-not-found__text">
          这页暂未落墨，可能已经迁移、改名，或只是还没写到这里。
        </p>
        <div class="zz-not-found__actions">
          <a class="zz-not-found__link zz-not-found__link--primary" href="/">回到首页</a>
          <a class="zz-not-found__link" href="/博客/">翻阅博客</a>
        </div>
      </main>
    </template>
  </Layout>
</template>

<style scoped>
.zz-not-found {
  display: grid;
  place-items: center;

  min-height: calc(100vh - var(--vp-nav-height));
  padding: 80px 18px;

  color: var(--zz-home-ink);
  text-align: center;
}

.zz-not-found__code {
  margin: 0 0 12px;

  font-family: var(--vp-font-family-mono);
  font-size: clamp(3.4rem, 12vw, 7.6rem);
  font-weight: 900;
  line-height: 1;
  color: var(--zz-cinnabar);
  letter-spacing: -0.08em;
}

.zz-not-found h1 {
  margin: 0;

  font-family: "Noto Serif SC", serif;
  font-size: clamp(1.8rem, 6vw, 3.2rem);
  font-weight: 900;
  letter-spacing: -0.04em;
}

.zz-not-found__text {
  max-width: 34rem;
  margin: 16px 0 0;

  font-size: 1rem;
  line-height: 1.9;
  color: var(--zz-home-soft);
}

.zz-not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;

  margin-top: 28px;
}

.zz-not-found__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  min-width: 118px;
  padding: 10px 16px;
  border: 1px solid var(--zz-home-border);
  border-radius: 999px;

  font-size: 0.9rem;
  font-weight: 900;
  color: var(--zz-home-ink);
  text-decoration: none;

  background: color-mix(in srgb, var(--zz-surface) 76%, transparent);

  transition: border-color 0.18s ease, color 0.18s ease, background 0.18s ease;
}

.zz-not-found__link:hover,
.zz-not-found__link--primary {
  border-color: var(--zz-border-strong);
  color: var(--zz-cinnabar);
  background: color-mix(in srgb, var(--zz-cinnabar) 10%, var(--zz-surface));
}
</style>
