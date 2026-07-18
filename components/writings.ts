/**
 * The book. Editing this file is how pages get in.
 */

export type WritingForm = "title" | "verse" | "prose";

export type WritingLeaf = {
  slug: string;
  form: WritingForm;
  /** Optional running head at the top of the leaf. */
  heading?: string;
  /**
   * title — short lines for the title page
   * verse — one string per line (tight)
   * prose — one string per paragraph
   */
  lines: string[];
};

export const BOOK = {
  title: "A small book",
  blurb:
    "Lines that shouldn’t live in Notes. Turn the page. Most of these were spoken in Hindi first.",
  leaves: [
    {
      slug: "title",
      form: "title",
      lines: ["A small book", "nishil"],
    },
    {
      slug: "agar-hindi-aati-hai",
      form: "verse",
      lines: ["अगर हिन्दी आती है,", "तो आँसू बहा कर ही जाओगे।"],
    },
    {
      slug: "tumse-milkar",
      form: "verse",
      lines: [
        "तुमसे मिलकर लगा था",
        "इश्क़ जान लूँगा —",
        "पर जिसे कोई जान नहीं पाया…",
        "वही तो इश्क़ है।",
      ],
    },
    {
      slug: "ghar-ka-intezaar",
      form: "title",
      lines: ["घर का इंतज़ार"],
    },
    {
      slug: "hadd-mein-rakha-karo",
      form: "verse",
      lines: [
        "अरे हद में रखा करो",
        "अपनी माशूका को —",
        "उसकी आँखों की गहराइयों ने",
        "मेरी समुंदर गहराइयों का",
        "मज़ाक बनाकर रखा है।",
      ],
    },
    {
      slug: "tum-aaogi",
      form: "verse",
      lines: ["तुम आओगी तो तुमसे बात करूँगा,", "पर तुम्हें जाने से नहीं रोक सकता।"],
    },
    {
      slug: "pyar-sabko-chahiye",
      form: "verse",
      lines: ["प्यार सबको चाहिए,", "बस अपनी शर्तों पे।"],
    },
    {
      slug: "dominoes",
      form: "verse",
      lines: [
        "क्या-क्या ईंटों को",
        "किस तरह गिरना पड़ेगा",
        "तुम्हें मेरे तक पहुँचने के लिए।",
      ],
    },
    {
      slug: "mere-shabd",
      form: "verse",
      lines: [
        "ये 'मैं' शब्द ही ऐसा —",
        "दूसरों के लिए",
        "प्यार कम कर ही देता है।",
      ],
    },
    {
      slug: "shayad-usi-din",
      form: "verse",
      lines: ["शायद उसी दिन से", "शायरी आ गई।"],
    },
    {
      slug: "paani-piti",
      form: "verse",
      lines: ["काश तुम ऐसी शिद्दत से पानी पीती", "कि मुझे बोतल पे गुस्सा आ जाए।"],
    },
    {
      slug: "life-goes-on",
      form: "verse",
      lines: [
        "Life goes on,",
        "people move on,",
        "but the show must go on.",
      ],
    },
    {
      slug: "poets-problem",
      form: "verse",
      lines: [
        "शायर की समस्या —",
        "जिन आँखों से शायर लोगों को देखता है,",
        "लोग उसे उन्हीं आँखों से",
        "नहीं देख पाएँगे।",
      ],
    },
    {
      slug: "pain-rage-page-stage",
      form: "verse",
      lines: [
        "so i took all that pain, tamed it,",
        "i took all that rage, put it on a page,",
        "and got it to the stage",
      ],
    },
    {
      slug: "mandir",
      form: "verse",
      lines: [
        "पता है कि मंदिर में",
        "भगवान को देखने जाते हैं —",
        "पर क्या करूँ,",
        "नज़र ही नहीं हटती तुमसे।",
      ],
    },
    {
      slug: "kismat",
      form: "verse",
      lines: [
        "किसी को पाने के लिए किस्मत चाहिए —",
        "इंतज़ार करने से तो",
        "वह किसी और के हो जाते हैं।",
      ],
    },
    {
      slug: "dono-door",
      form: "verse",
      lines: ["दोनों दूर हैं,", "वो नहीं मेरा —", "पर मोहब्बत है तो है।"],
    },
    {
      slug: "sirf-tumhe-nahi",
      form: "verse",
      lines: [
        "तुम्हें लगता है",
        "सिर्फ़ तुम्हें नहीं मिला अपना प्यार —",
        "क्या पता शायद",
        "उसे भी ना मिला अपना प्यार।",
      ],
    },
    {
      slug: "mohabbat-se-bhi",
      form: "verse",
      lines: ["ज़रूर मोहब्बत है तुमसे,", "पर मुझे मोहब्बत से भी", "मोहब्बत है।"],
    },
    {
      slug: "pyar-ke-khatir",
      form: "verse",
      lines: ["उसके खातिर नहीं —", "पर प्यार के खातिर", "प्यार ज़रूर करना।"],
    },
    {
      slug: "ekdum-chup",
      form: "verse",
      lines: [
        "मैं एकदम चुप हूँ,",
        "नहीं कुछ बोलना चाहता —",
        "मैं बस होना चाहता हूँ,",
        "उधर, उसके पास।",
      ],
    },
    {
      slug: "zulfein-suljhane",
      form: "verse",
      lines: ["तुम्हारी ज़ुल्फ़ें सुलझाने दोगी क्या?"],
    },
    {
      slug: "aaj-itne-khush",
      form: "verse",
      lines: ["आज इतने खुश कैसे हो?", "— ख़्वाब में उसकी ज़ुल्फ़ें", "उलझा कर आया हूँ।"],
    },
    {
      slug: "zamane-se",
      form: "verse",
      lines: ["अरे क्या लड़ेगा तू ज़माने से,", "जब तू उसी से ना लड़ पाया", "उसी के लिए।"],
    },
    {
      slug: "seth-baarish",
      form: "verse",
      lines: ["सेठ,", "सबका बारिश अलग रहता है।"],
    },
    {
      slug: "ab-theek-hun",
      form: "verse",
      lines: ["उसने बोला कैसे हो —", "मैंने उसकी गोद में सर रखकर बोला,", "अब ठीक हूँ।"],
    },
    {
      slug: "milne-ka-waqt",
      form: "verse",
      lines: ["is “soon” even a time to meet?"],
    },
    {
      slug: "duniya-kamaal",
      form: "verse",
      lines: [
        "ये दुनिया कमाल है,",
        "क्योंकि तू कमाल है…",
        "तुझे चीज़ें ख़ूबसूरत लगती हैं,",
        "क्योंकि तू ख़ूबसूरत है…",
        "सब कुछ बेहतरीन है,",
        "क्योंकि तू बेहतरीन है…",
      ],
    },
    {
      slug: "tu-mili-to-bhi",
      form: "verse",
      lines: [
        "तू मिली तो भी ठीक,",
        "तू ना मिली तो भी ठीक —",
        "शायद ये मोहब्बत",
        "तेरे नाम की ही नहीं थी।",
      ],
    },
    {
      slug: "pesha",
      form: "verse",
      lines: [
        "कौन हैं वो लोग जो बोलते हैं",
        "कि कोई लोग नहीं सोचते",
        "एक दूसरे के बारे में —",
        "इधर मैंने तो तेरे बारे सोचने को",
        "पेशा बना के रखा है।",
      ],
    },
    {
      slug: "surprises",
      form: "verse",
      lines: [
        "you say you like surprises,",
        "but you don’t give God a chance",
        "to even surprise you.",
      ],
    },
    {
      slug: "yaadein",
      form: "verse",
      lines: ["अगर तेरी यादें ही", "इतनी ख़ूबसूरत हैं,", "तो हक़ीक़त तो क्या ही होती।"],
    },
    {
      slug: "ijazat",
      form: "verse",
      lines: [
        "सोचा तुमसे इजाज़त ले लूँ,",
        "ज़रा दूसरी तरफ़ देखने की,",
        "बहुत कोशिश की मैंने,",
        "तुम पर ये दिल न हारने की!",
        "",
        "मगर इस बेशर्म दिल पर",
        "मेरा कोई ज़ोर नहीं,",
        "तुम्हें देखने के बाद अब",
        "दिखता कोई और नहीं!",
      ],
    },
  ] satisfies WritingLeaf[],
};
