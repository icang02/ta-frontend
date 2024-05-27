import { useEffect, useRef, useState } from "react";
import { axiosCustom } from "../lib/axiosCustom.js";

const TextInput = () => {
  // state input
  const [preview, setPreview] = useState(null);
  const [copied, setCopied] = useState(false);
  const [textareaScrollTop, setTextareaScrollTop] = useState(0);
  const [dictionaryState, setDictionaryState] = useState([]);

  // predictive
  const [userText, setUserText] = useState("");
  const [aiText, setAIText] = useState("");
  const [kamus, setKamus] = useState([]);

  useEffect(() => {
    const debounce = setTimeout(async () => {
      try {
        const response = await axiosCustom.post("/deteksi-ejaan", {
          reqInput: userText,
        });

        setDictionaryState(response.data.dictionaryLookup);
        const data = [];

        const suggest = response.data.suggestWord
          .filter((item) => item[0].target !== "-")
          .map((item) =>
            data.push({
              kata: item[0].str,
              type: 1,
              saran: [item],
            })
          );
        const notFound = response.data.suggestWord
          .filter((item) => item[0].target === "-")
          .map((item) => data.push({ kata: item[0].str, type: 0, saran: [] }));

        const previewComponent = (
          <>
            {userText.split(/\b(\w+)\b/g).map((part, index) => {
              const matchingObject = data.find((item) => item.kata === part);

              if (matchingObject && matchingObject.type === 1) {
                return (
                  <span className="relative group" key={index}>
                    <span className="text-red-500 cursor-pointer">{part}</span>
                    <span className="z-50 hidden group-hover:block absolute left-0 top-3 cursor-pointer">
                      <div className="text-xs mt-2 w-fit text-gray-900 bg-white border border-gray-200 rounded-lg">
                        {matchingObject.saran[0].map((itemSaran, i) => (
                          <div
                            key={i}
                            onClick={() =>
                              handleSaran(matchingObject.kata, itemSaran.target)
                            }
                            type="button"
                            className="relative inline-flex items-center w-full px-4 py-2 font-normal border-b border-gray-200 rounded-t-lg hover:bg-gray-100 hover:text-blue-600 focus:z-10 text-nowrap"
                          >
                            {itemSaran.target} ({itemSaran.similarity}%)
                          </div>
                        ))}
                      </div>
                    </span>
                  </span>
                );
              } else if (matchingObject && matchingObject.type === 0) {
                return (
                  <span className="relative group" key={index}>
                    <span className="text-slate-400">{part}</span>
                    <span className="z-50 hidden group-hover:block absolute left-0 top-3">
                      <div className="text-xs mt-2 w-fit text-gray-900 bg-white border border-gray-200 rounded-lg">
                        <div className="relative inline-flex items-center w-full px-4 py-2 font-normal border-gray-200 border-b rounded-b-lg rounded-t-lg focus:z-10 text-nowrap">
                          Kata tidak ditemukan
                        </div>
                      </div>
                    </span>
                  </span>
                );
              } else {
                if (part.includes("\n")) {
                  const newlineCount = (part.match(/\n/g) || []).length;

                  const brComponent = [];
                  for (let i = 0; i < newlineCount; i++) {
                    brComponent.push(<br key={i} />);
                  }
                  return brComponent;
                } else {
                  return part;
                }
              }
            })}
          </>
        );

        setPreview(previewComponent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }, 200);

    return () => clearTimeout(debounce);
  }, [userText]);

  // simpan data kamus di localstorage
  useEffect(() => {
    const fetchKamus = async () => {
      try {
        const res = await axiosCustom.post("/get-all-kamus");
        setKamus(res.data);

        if (localStorage.getItem("kamus") == null) {
          const data = res.data.map((item) => ({
            kata: item,
            frekuensi: 0,
          }));

          localStorage.setItem("kamus", JSON.stringify(data));
        }
      } catch (error) {
        console.log(`Error fetch : ${error}`);
      }
    };

    fetchKamus();
  }, []);

  const handleRiwayat = () => {
    if (userText.length > 0) {
      let kamus = JSON.parse(localStorage.getItem("kamus"));

      dictionaryState.map((item) => {
        let findWord = kamus.find((item2) => item2.kata == item);

        if (findWord) {
          findWord.frekuensi += 1;
        }
      });

      kamus.sort((a, b) => b.frekuensi - a.frekuensi);
      localStorage.setItem("kamus", JSON.stringify(kamus));
    }
  };

  const handleResetRiwayat = () => {
    let kamus = JSON.parse(localStorage.getItem("kamus"));
    kamus = kamus.map((item) => ({ ...item, frekuensi: 0 }));
    kamus.sort((a, b) => a.kata.localeCompare(b.kata));

    kamus = JSON.stringify(kamus);

    localStorage.setItem("kamus", kamus);
  };

  const handleSaran = (string, target) => {
    setUserText((prev) => prev.replaceAll(string, target));
  };

  const handleCopy = () => {
    const textToCopy = preview;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  function countWords(kalimat) {
    return kalimat.trim().split(/\s+/).length;
  }

  const handleInputScrool = (e) => {
    setTextareaScrollTop(e.target.scrollTop);
  };

  const debounceTimeoutRef = useRef(null);
  const contentEditableRef = useRef(null);

  let enterPressed = false;

  const fetchSuggestions = (text) => {
    let foundString = "";
    let textSplit = text.split(" ");
    let textLastIndex = textSplit[textSplit.length - 1];

    let kamus = JSON.parse(localStorage.getItem("kamus"));
    for (let i = 0; i < kamus.length; i++) {
      if (kamus[i].kata.toLowerCase().startsWith(textLastIndex.toLowerCase())) {
        foundString = kamus[i].kata;
        break;
      }
    }

    if (text.trim().length) {
      setAIText(foundString.slice(textLastIndex.length));
    }
  };

  const isCursorAtEnd = () => {
    const selection = window.getSelection();
    return selection.anchorOffset === selection.anchorNode.length;
  };

  const handleInput = (e) => {
    let newText = e.target.innerText;
    if (enterPressed && newText.endsWith("\n\n")) {
      // Remove the last newline character
      newText = newText.slice(0, -1);

      // Reset the flag
      enterPressed = false;
    }

    setUserText(newText);
    setAIText("");

    // Check if cursor is at the end
    if (isCursorAtEnd()) {
      // Debounce the API call
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = setTimeout(() => {
        fetchSuggestions(newText);
      }, 100);
    }
  };

  const focusContentEditable = () => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus();
    }
  };

  const setCursorToEnd = (element) => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(element);
    range.collapse(false); // false means collapse to end rather than the start
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const acceptSuggestion = () => {
    const contentEditableElement = contentEditableRef.current;
    if (aiText) {
      setUserText(userText + aiText);
      contentEditableElement.innerText = userText + aiText + " ";
      setAIText("");
      setCursorToEnd(contentEditableElement);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      acceptSuggestion();
    }

    if (event.key === "Enter") {
      // Set the flag to true when Enter is pressed
      enterPressed = true;

      // Allow the default Enter key behavior to occur
      setTimeout(() => {
        const contentEditableElement = contentEditableRef.current;
        const childNodes = Array.from(contentEditableElement.childNodes);

        // Find the last <br> element
        for (let i = childNodes.length - 1; i >= 0; i--) {
          if (childNodes[i].nodeName === "BR") {
            // Remove the last <br> element
            contentEditableElement.removeChild(childNodes[i]);
            break; // Exit the loop after removing the <br>
          }
        }

        // Insert an empty text node with a zero-width space
        const emptyTextNode = document.createTextNode("\u200B");
        contentEditableElement.appendChild(emptyTextNode);

        // Set cursor after the empty text node
        setCursorToEnd(contentEditableElement);
      }, 0); // SetTimeout with delay of 0 to allow the stack to clear and the <br> to be inserted
    }
  };

  return (
    <div className="grid grid-cols-12 gap-x-5 gap-y-4 lg:gap-y-0">
      <div className="col-span-12 order-2 px-2 lg:col-span-6 lg:px-0 relative">
        <h4 className="mb-1 text-[15px]">Preview Text</h4>

        <div
          onScroll={handleInputScrool}
          className="previewInput text-[15px] text-[#333] p-4 h-[370px] leading-[21px] rounded-xl border border-slate-400 bg-white overflow-y-scroll overflow-x-hidden"
        >
          {preview}
        </div>

        <div className="mt-2 flex justify-end items-center">
          <button
            onClick={handleCopy}
            className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="col-span-12 order-1 px-2 lg:col-span-6 lg:px-0 rounded-xl">
        <h4 className="mb-1 text-[15px]">Input Text</h4>

        <div
          onClick={focusContentEditable}
          className="cursor-text inputText text-[15px] text-[#333] p-4 h-[370px] leading-[21px] rounded-xl border border-slate-400 bg-white overflow-y-scroll overflow-x-hidden"
        >
          <span
            ref={contentEditableRef}
            className="outline-none"
            contentEditable={true}
            suppressContentEditableWarning="true"
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onScroll={handleInputScrool}
          >
            {/* {userText} */}
          </span>

          <span
            className={`text-sm text-gray-400 transition-opacity ${
              aiText ? "opacity-100" : "opacity-0"
            }`}
            contentEditable={false}
          >
            {aiText.length > 0 && (
              <>
                {aiText}
                <span
                  onClick={() => {
                    acceptSuggestion();
                  }}
                  className="border p-1.5 py-0 text-[11px] ml-1 inline-block w-fit rounded-md text-[#333] opacity-70 cursor-pointer"
                >
                  Tab
                </span>
              </>
            )}
          </span>
        </div>

        <div className="mt-2 flex justify-between items-center">
          <p className="text-[14px]">
            {userText.length ? countWords(userText) + " kata" : ""}
          </p>
          <button
            onClick={() => setUserText("")}
            className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
          >
            Reset
          </button>
          <button
            onClick={handleRiwayat}
            className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
          >
            Simpan Riwayat
          </button>
          <button
            onClick={handleResetRiwayat}
            className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
          >
            Reset Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
