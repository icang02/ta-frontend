// src/components/Chat.js
import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";

const Chat = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const getSuggestions = async (inputValue) => {
    try {
      const response = await axios.get(
        `https://api.bing.com/chat/v1/suggestions?q=${inputValue}`
      );
      return response.data.suggestions;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    const suggestions = await getSuggestions(value);
    setSuggestions(suggestions);
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const renderSuggestion = (suggestion) => <div>{suggestion.displayText}</div>;

  const inputProps = {
    placeholder: "Type something...",
    value,
    onChange: (_, { newValue }) => setValue(newValue),
  };

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={(suggestion) => suggestion.displayText}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
    />
  );
};

export default Chat;
