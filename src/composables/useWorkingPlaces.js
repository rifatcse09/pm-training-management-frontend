import { ref } from "vue";

export function useWorkingPlaces() {
  const workingPlaces = ref([
    { id: 1, name: "পরিকল্পনা বিভাগ" },
    { id: 2, name: "কার্যক্রম বিভাগ" },
    { id: 3, name: "কৃষি,পানি সম্পদ ও পল্লী প্রতিষ্ঠান বিভাগ" },
    { id: 4, name: "ভৌত অবকাঠামো বিভাগ" },
    { id: 5, name: "শিল্প ও শক্তি বিভাগ" },
    { id: 6, name: "আর্থ-সামাজিক অবকাঠামো বিভাগ" },
    { id: 7, name: "সাধারণ অর্থনীতি বিভাগ" },
  ]);

  return { workingPlaces };
}
