const BASE_URL = 'https://www.fittersstudio.com'

/**
 * 각 로케일 페이지가 "자기 자신"을 canonical로 가리키도록 만드는 헬퍼.
 * 언어 구분 없는 bare URL(예: /calculator)은 실제로는 콘텐츠 없이
 * /ko 또는 /en으로 리다이렉트만 하는 주소라, 그걸 canonical로 쓰면
 * 구글이 /ko·/en 둘 다 "신뢰 못 할 중복"으로 보고 색인에서 제외한다.
 */
export function localizedAlternates(locale: string, path: string) {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      ko: `${BASE_URL}/ko${path}`,
      en: `${BASE_URL}/en${path}`,
    },
  }
}
