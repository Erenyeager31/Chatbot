import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

export const generateResponse = async (prompt: string) => {
  try {
    const response = await hf.textGeneration({
      // model: "OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5", // Replace with the model ID you want to use
      model: "google/flan-t5-base",
      inputs: prompt,
      parameters: {
        max_length: 150,
        do_sample: true,
        top_p: 0.95,
        top_k: 50,
      },
    });
    console.log(response)
    return {
      status:true,
      response
    };
  } catch (error) {
    console.error("Error in conversation:", error);
    return {
      status:false,
      response:'Could not generate a response'
    };
  }
};