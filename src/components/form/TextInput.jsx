import { useEffect, useRef, useState } from "react";
import { axiosCustom } from "../../lib/axiosCustom";
import { createPortal, render } from "react-dom";

const TextInput = () => {
  const textareaRef = useRef(null);
  const previewRef = useRef(null);
  const [inputUser, setInputUser] = useState("");
  const [wordSuggestion, setWordSuggestion] = useState("");
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState(null);
  const [isSyncingScroll, setIsSyncingScroll] = useState(false);
  const [kamusDetect, setKamusDetect] = useState([]);

  const [isValid, setIsValid] = useState(true);

  const maksInput = 10000;

  // useeffect untuk hasil koreksi dan saran
  useEffect(() => {
    const debounce = setTimeout(async () => {
      const response = await axiosCustom.post("/deteksi-ejaan", {
        reqInput: inputUser,
        kamusDetect: kamusDetect,
      });
      const suggest = response.data.suggestWord;

      if (response.data.dictionaryLookup.length != 0) {
        let arr = [];
        response.data.dictionaryLookup.forEach((item) => {
          arr.push(item);
        });

        setKamusDetect((prev) => {
          const newKamusDetect = prev.concat(arr);
          const uniqueKamusDetect = Array.from(
            new Set(newKamusDetect.map((item) => JSON.stringify(item)))
          ).map((item) => JSON.parse(item));

          return uniqueKamusDetect;
        });
      }
      // console.log(kamusDetect);

      const previewComponent = () => {
        return inputUser.split("\n").map((line, lineIndex) => (
          <span key={lineIndex}>
            {line.split(/\b(\w+)\b/g).map((part, partIndex) => {
              const matchingObject = suggest.find(
                (item) => item.string == part
              );

              if (matchingObject && matchingObject.type == 1) {
                return (
                  <TooltipWrapper
                    key={partIndex}
                    tooltipContent={matchingObject.suggestions}
                  >
                    {part}
                  </TooltipWrapper>
                );
              } else if (matchingObject && matchingObject.type == 2) {
                return (
                  <TooltipWrapper
                    key={partIndex}
                    tooltipContent={matchingObject.suggestions}
                  >
                    {part}
                  </TooltipWrapper>
                );
              } else if (matchingObject && matchingObject.type == 3) {
                return (
                  <span key={partIndex} className="text-slate-400 font-medium">
                    {part}
                  </span>
                );
              } else {
                return <span key={partIndex}>{part}</span>;
              }
            })}
            <br />
          </span>
        ));
      };

      setPreview(previewComponent);
    }, 200);

    return () => clearTimeout(debounce);
  }, [inputUser]);

  // useeffect fetch data kamus
  useEffect(() => {
    const fetchKamus = async () => {
      const res = await axiosCustom.post("/get-all-kamus");
      if (localStorage.getItem("kamus") == null) {
        const data = res.data.map((item, index) => ({
          word: item,
          count: 0,
          percentage: Math.floor(Math.random() * 100 * (index + 1)),
        }));
        data.sort((a, b) => b.percentage - a.percentage);

        localStorage.setItem("kamus", JSON.stringify(data));
      }
    };

    fetchKamus();
  }, []);

  // useeffect untuk handle saran pakai tombol tab
  useEffect(() => {
    if (inputUser.length != 0) {
      let kamus = JSON.parse(localStorage.getItem("kamus"));

      let lastSpaceIndex = inputUser.lastIndexOf(" ");
      let lastNewLineIndex = inputUser.lastIndexOf("\n");
      let lastSpaceOrNewLineIndex = Math.max(lastSpaceIndex, lastNewLineIndex);

      let inputUserLast = inputUser.substring(lastSpaceOrNewLineIndex + 1);

      if (inputUserLast == "") {
        setWordSuggestion("");
      } else {
        let wordFind = kamus.find((item) =>
          item.word.startsWith(inputUserLast)
        );
        if (wordFind != null) {
          setWordSuggestion(wordFind.word);
        }
      }
    } else {
      setWordSuggestion("");
    }
  }, [inputUser]);

  // useeffect handle tombol tab dan enter
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        setWordSuggestion("");
      }

      if (event.key === "Tab") {
        event.preventDefault();

        let lastSpaceIndex = inputUser.lastIndexOf(" ");
        let lastNewLineIndex = inputUser.lastIndexOf("\n");
        let lastSpaceOrNewLineIndex = Math.max(
          lastSpaceIndex,
          lastNewLineIndex
        );

        let beforeLastWord = inputUser.substring(
          0,
          lastSpaceOrNewLineIndex + 1
        );
        setInputUser(beforeLastWord + wordSuggestion);
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [wordSuggestion]);

  // useeffect handle scrool textarea dan preview
  useEffect(() => {
    const syncScroll = (source, target) => {
      const scrollRatio =
        source.scrollTop / (source.scrollHeight - source.clientHeight);
      target.scrollTop =
        scrollRatio * (target.scrollHeight - target.clientHeight);
    };

    const handleTextareaScroll = () => {
      if (!isSyncingScroll) {
        setIsSyncingScroll(true);
        syncScroll(textareaRef.current, previewRef.current);
        setIsSyncingScroll(false);
      }
    };

    const handlePreviewScroll = () => {
      if (!isSyncingScroll) {
        setIsSyncingScroll(true);
        syncScroll(previewRef.current, textareaRef.current);
        setIsSyncingScroll(false);
      }
    };

    const textarea = textareaRef.current;
    const preview = previewRef.current;

    if (textarea && preview) {
      textarea.addEventListener("scroll", handleTextareaScroll);
      preview.addEventListener("scroll", handlePreviewScroll);
    }

    return () => {
      if (textarea && preview) {
        textarea.removeEventListener("scroll", handleTextareaScroll);
        preview.removeEventListener("scroll", handlePreviewScroll);
      }
    };
  }, [isSyncingScroll]);

  const countWords = (inputUser) => {
    return inputUser.length;
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setInputUser(value);
  };

  const handleCopy = () => {
    const textToCopy = inputUser;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    });
  };

  // const handleResetSaran = () => {
  //   const kamus = JSON.parse(localStorage.getItem("kamus"));
  //   const kamusReset = kamus.map((item) => ({
  //     word: item.word,
  //     count: 0,
  //     percentage: 0,
  //   }));

  //   localStorage.removeItem("kamus");
  //   localStorage.setItem(
  //     "kamus",
  //     JSON.stringify(kamusReset.sort((a, b) => a.word.localeCompare(b.word)))
  //   );
  // };

  // masih error
  const handleSelectSuggestion = (part, target) => {
    setInputUser((prev) => prev.replaceAll(part, target));
  };

  const handleSave = () => {
    alert("okee");
  };

  function Tooltip({ string, children, targetRef }) {
    const containerRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const [containerHeight, setContainerHeight] = useState(0);

    if (!targetRef.current) {
      return null;
    }

    const rect = targetRef.current.getBoundingClientRect();

    let renderComp = null;
    let styleCon = {};

    if (Array.isArray(children)) {
      styleCon = {
        top: `${rect.top + window.scrollY - 35}px`,
        left: `${rect.left + window.scrollX + 5.5}px`,
        transform: `translateY(calc(-${containerHeight}px + 34px))`,
      };

      renderComp = children.map((item, i) => (
        <span key={i}>
          <div
            onClick={() => handleSelectSuggestion(string, item.target)}
            className={`cursor-pointer px-4 py-2 border-gray-500 hover:text-blue-600 ${
              i !== children.length - 1 && "border-b"
            }`}
          >
            <span className="font-medium">{item.target}</span> (
            {item.similarity}%)
          </div>
        </span>
      ));
    } else if (typeof children === "string") {
      styleCon = {
        top: `${rect.top + window.scrollY - 35}px`,
        left: `${rect.left + window.scrollX + 6}px`,
        transform: `translateY(calc(-${containerHeight}px + 34px))`,
      };

      renderComp = (
        <div
          onClick={() => handleSelectSuggestion(string, children)}
          className="cursor-pointer px-4 py-2 border-gray-500 hover:text-blue-600"
        >
          <span className="font-medium">{children}</span>
        </div>
      );
    } else if (typeof children === "object") {
      styleCon = {
        top: `${rect.top + window.scrollY - 35}px`,
        left: `${rect.left + window.scrollX + 6}px`,
        transform: `translateY(calc(-${containerHeight}px + 34px))`,
      };

      renderComp = (
        <div
          onClick={() => handleSelectSuggestion(string, children.target)}
          className="cursor-pointer px-4 py-2 border-gray-500 hover:text-blue-600"
        >
          <span className="font-medium">{children.target}</span> (
          {children.similarity}%)
        </div>
      );
    }

    useEffect(() => {
      const checkOverflow = () => {
        if (containerRef.current) {
          const { scrollHeight, clientHeight } = containerRef.current;
          setIsOverflowing(scrollHeight > clientHeight);
        }
      };

      checkOverflow();

      if (containerRef.current) {
        setContainerHeight(containerRef.current.offsetHeight);
        // console.log(containerHeight);
      }
    }, [children, renderComp]);

    return createPortal(
      <div
        ref={containerRef}
        className={`absolute text-xs bg-white rounded-sm border border-gray-400 max-h-[165px] ${
          isOverflowing ? "overflow-y-scroll" : ""
        }`}
        style={styleCon}
      >
        {renderComp}
      </div>,
      document.body
    );
  }

  function TooltipWrapper({ children, tooltipContent }) {
    const [hover, setHover] = useState(false);
    const targetRef = useRef(null);

    return (
      <span className="relative">
        <span
          className={`relative text-red-500 font-medium cursor-pointer ${
            Array.isArray(tooltipContent) && "underline"
          }`}
          ref={targetRef}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {children}
          {hover && (
            <Tooltip string={children} targetRef={targetRef}>
              {tooltipContent}
            </Tooltip>
          )}
        </span>
      </span>
    );
  }

  const handleHeightPreview = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const y = event.clientY - rect.top;
    setHeightPreview(y);
  };

  return (
    <div className="grid grid-cols-12 gap-x-5 gap-y-4 lg:gap-y-0">
      <div className="col-span-12 order-2 px-2 lg:col-span-6 lg:px-0">
        <h4 className="mb-1 text-[15px]">Preview Text</h4>

        <div
          ref={previewRef}
          onMouseMove={handleHeightPreview}
          className="relative text-[15px] text-[#333] p-4 pb-5 h-[370px] leading-[21px] rounded-xl border border-slate-400 bg-white overflow-y-scroll"
        >
          <div>{preview}</div>
        </div>

        <div className="mt-3.5 flex space-x-1.5 justify-end items-center">
          <button
            onClick={handleCopy}
            className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            disabled={inputUser.length == 0}
            onClick={handleSave}
            className={`rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] transition-all ${
              inputUser.length == 0
                ? "opacity-75 cursor-auto"
                : "hover:bg-[#508d99]"
            }`}
          >
            Simpan
          </button>
        </div>
      </div>

      <div className="col-span-12 order-1 px-2 lg:col-span-6 lg:px-0 rounded-xl">
        <div className="relative flex items-center justify-between">
          <h4 className="mb-1 text-[15px]">Input Text</h4>

          <div
            className={`absolute right-0 bottom-2 transition-all duration-300 ${
              wordSuggestion.length == 0 ? "opacity-0" : "opacity-100"
            }`}
          >
            <span className="text-xs mr-1.5">Tab</span>
            <span className="text-sm bg-white rounded-sm px-3.5 py-1 border border-gray-400">
              {wordSuggestion}
            </span>
          </div>
        </div>

        <textarea
          placeholder="Masukkan teks..."
          onChange={handleChange}
          value={inputUser}
          ref={textareaRef}
          maxLength={maksInput}
          className="resize-none w-full outline-none text-[15px] text-[#333] p-4 pb-5 h-[370px] leading-[21px] rounded-xl border border-slate-400 bg-white overflow-y-scroll overflow-x-hidden"
        >
          {inputUser}
        </textarea>

        <div className="mt-2 flex justify-between items-center">
          <div
            className={`text-sm ${
              countWords(inputUser) >= maksInput && "text-blue-500 font-medium"
            }`}
          >
            {inputUser == "" ? 0 : countWords(inputUser).toLocaleString()} /{" "}
            {maksInput.toLocaleString()} karakter
          </div>
          <div className="flex space-x-1.5">
            <button
              onClick={() => setInputUser("")}
              className="rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
            >
              Kosongkan
            </button>
            {/* <button
              onClick={handleResetSaran}
              className="disabled rounded px-8 py-1 bg-[#64a1ad] text-white text-[15px] hover:bg-[#508d99]"
            >
              Reset
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
