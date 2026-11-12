# અમૂલ પાર્લર ખોડાણા (Amul Parlour Khodana)
### દૂધ મંડળી દ્વારા સંચાલિત (Managed by Milk Cooperative Society)
**WhatsApp / સંપર્ક:** 8849526589

---

## 📌 પરિચય (About the Project)
આ એક આધુનિક, ઝડપી અને મોબાઇલ-ફ્રેન્ડલી વેબ એપ્લિકેશન છે જે **અમૂલ પાર્લર ખોડાણા** માટે બનાવવામાં આવી છે.
- **દુકાનેથી જ પિકઅપ પોલિસી (Shop Pickup Only):** ગ્રાહકો વેબસાઇટ પરથી ઓર્ડર આપી શકે છે અને દુકાને આવીને સામાન મેળવી શકે છે. હોમ ડિલિવરી ઉપલબ્ધ નથી.
- **વોટ્સએપ નોટિફિકેશન (WhatsApp Notifications):** દરેક નવો ઓર્ડર આપમેળે પાર્લરના WhatsApp નંબર `8849526589` પર પહોંચે છે.
- **તમામ ૧૨ કેટેગરીઓ (12 Full Categories):** દૂધ, આઈસ્ક્રીમ, બટર, ચીઝ, ઘી, પનીર, દહીં, છાસ, શ્રીખંડ, ચોકલેટ્સ, પીણાં અને અન્ય ઉત્પાદનો.
- **એડમિન પેનલ (/admin):** પાસકોડ `Amul@8849` સાથે સુરક્ષિત. સીધા ફોન કેમેરા કે ગેલરીમાંથી ફોટો ઓટો-કમ્પ્રેસ થઈને અપલોડ થાય છે.

---

## 🚀 GitHub પર પ્રોજેક્ટ કઈ રીતે મૂકવો (How to Push to GitHub)

જો તમે તમારા પોતાના GitHub એકાઉન્ટ પર આ પ્રોજેક્ટ અપલોડ કરવા માંગો છો:

### પગલું ૧: GitHub પર નવી રિપોઝીટરી બનાવો
1. [GitHub](https://github.com) ખોલો અને લોગિન કરો.
2. જમણી બાજુ ઉપર **`+`** પર ક્લિક કરી **New repository** પસંદ કરો.
3. રિપોઝીટરીનું નામ આપો (દા.ત. `amul-parlour-khodana`).
4. **Public** અથવા **Private** પસંદ કરો અને **Create repository** બટન પર ક્લિક કરો.

### પગલું ૨: તમારા કમ્પ્યુટર કે ટર્મિનલમાંથી Push કરો
```bash
# ૧. ગિટ રિપોઝીટરી શરૂ કરો (જો ન હોય તો)
git init

# ૨. બધી ફાઇલો ઉમેરો
git add .

# ૩. કમિટ કરો
git commit -m "Initial release of Amul Parlour Khodana web app"

# ૪. મુખ્ય શાખાનું નામ main રાખો
git branch -M main

# ૫. તમારી GitHub રિપોઝીટરી લિંક જોડો (તમારા યુઝરનેમ સાથે બદલો):
git remote add origin https://github.com/<તમારું_GITHUB_USERNAME>/amul-parlour-khodana.git

# ૬. ગિટહબ પર પુશ કરો
git push -u origin main
```

---

## 🌐 ફ્રી લાઇવ હોસ્ટિંગ (Free Web Hosting from GitHub)

### ⚠️ વ્હાઇટ પેજ (White Page) કેમ દેખાય છે અને તેનો ઉકેલ:
જ્યારે GitHub Pages પર ડિફોલ્ટ રૂપે "Deploy from a branch (root)" પસંદ કરેલું હોય ત્યારે બ્રાઉઝર TypeScript/React કોડ સીધો ચલાવી શકતું નથી જેથી સફેદ સ્ક્રીન (White Page) દેખાય છે. આના ઉકેલ માટે નીચેના ૨ રસ્તા છે:

#### રસ્તો ૧: GitHub Pages માં "GitHub Actions" પસંદ કરો (Free & Automatic)
1. તમારી GitHub રિપોઝીટરીમાં ઉપર **Settings** પર જાઓ.
2. ડાબી બાજુ મેનૂમાંથી **Pages** પર ક્લિક કરો.
3. **Build and deployment** -> **Source** માં **"GitHub Actions"** પસંદ કરો (Deploy from a branch ની જગ્યાએ).
4. બસ! અમે ઉમેરેલ વર્કફ્લો આપમેળે સાઇટ બિલ્ડ કરીને લાઇવ લિંક આપી દેશે. વ્હાઇટ પેજ નહીં આવે!

#### રસ્તો ૨: Vercel પર હોસ્ટિંગ (સૌથી સરળ અને શ્રેષ્ઠ)
1. [vercel.com](https://vercel.com) પર જઈ તમારા GitHub વડે લૉગિન કરો.
2. **Add New...** -> **Project** પર ક્લિક કરી `amul-parlour-khodana` રિપોઝીટરી સિલેક્ટ કરો.
3. **Deploy** બટન દબાવો. Vercel આપમેળે બિલ્ડ કરીને લાઇવ લિંક આપી દેશે (જેમ કે `amul-parlour-khodana.vercel.app`).
3. રિપોઝીટરી સિલેક્ટ કરી **Deploy** પર ક્લિક કરો.

---

## 💻 લોકલ કમ્પ્યુટર પર રન કરવા માટે (Run Locally)

```bash
# ૧. ડીપેન્ડન્સી ઇન્સ્ટોલ કરો
npm install

# ૨. ડેવલપમેન્ટ સર્વર શરૂ કરો
npm run dev

# બ્રાઉઝરમાં http://localhost:3000 ખોલો.
```

---

## 🔐 એડમિન એક્સેસ (Admin Access)
- **એડમિન URL:** `/admin`
- **એડમિન ઇમેઇલ:** `admin@amulkhodana.com`
- **એડમિન પાસવર્ડ:** `Amul@8849`

---

## 🛠️ ટેક્નોલોજી સ્ટેક (Tech Stack)
- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide React
- **Backend / API:** Node.js, Express
- **Database:** Google Cloud Firestore
- **Real-time Engine:** Firebase Realtime Listeners
