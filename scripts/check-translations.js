import { translations } from '../src/i18n/translations.ts';

console.log('FR title:', JSON.stringify(translations.fr.hero.title));
console.log('FR subtitle:', JSON.stringify(translations.fr.hero.subtitle));
console.log('FR cta:', JSON.stringify(translations.fr.hero.cta));

console.log('\nChar codes for FR subtitle:');
const sub = translations.fr.hero.subtitle;
for (let i = 0; i < sub.length; i++) {
  console.log(`  char ${i}: '${sub[i]}' (code: ${sub.charCodeAt(i)})`);
}
