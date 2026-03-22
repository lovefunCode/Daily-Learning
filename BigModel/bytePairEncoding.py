from collections import defaultdict, Counter
import re


class BytePairEncoding:
    def __init__(self, vocab_size):
        self.vocab_size = vocab_size
        self.vocab = {}   # token -> id
        self.merges = {}   # (token1, token2) --> merge_token

    def train(self, corpus):
        # step1 : initialize with characters
        words = self._get_word_frequencies(corpus)

        # print('words', words)

        # get initial vacabulary (all unique characters)
        chars = set()
        for word in words:
            chars.update(word)

        print('chars---', chars)

        self.vocab = {
            char: idx for idx, char in enumerate(sorted(chars))
        }

        print(f"Inital vocab size: {len(self.vocab)}")

        # step2: iteratively merge most frequent pairs
        num_merges = self.vocab_size - len(self.vocab)
        # print('num_merges---', num_merges)

        for i in range(num_merges):
            # count all adjacent pairs
            pairs = self._get_pair_stastics(words)

            if not pairs:
                break
        
            print('pairs---', pairs)
            # find the most frequent pair
            best_pair = max(pairs, key=pairs.get)

            print('best_pair---', best_pair)

            # merge the pair
            new_token = ''.join(best_pair)
            self.merges[best_pair] = new_token

            # add new token to vocabulary
            self.vocab[new_token] = len(self.vocab)

            words = self._merge_pair(words, best_pair, new_token)


    def _merge_pair(self, words, pair, new_token):
        new_word = {}
        for word, freq in words.items():
            


    def _get_pair_stastics(self, words):
        # count frequencies of all adjacent pairs

        pairs = defaultdict(int)

        # print('words.items()',words.items())
        for word, freq in words.items():
            # word is a tuple like ('l', 'o', 'w', '</w>')
            # freq is how many times this word appears
            symbols = list(word)
            
            #  loop through adjacent positions
            for i  in range(len(symbols) - 1):
                # i=0, pair = (symbols[0], symbols[1]) = ('l', 'o')
                # i=1, pair = (symbols[1], symbols[2]) = ('0', 'w')
                # i=2, pair = (symbols[2], symbols[3]) = ('w', '</w>')

                pair = (symbols[i], symbols[i+1])

                # add this words's frequency to the pair's count
                pairs[pair] += freq

        return pairs


    def _get_word_frequencies(self, corpus):
        # split corpus into words and count frequencies
        # returns: dict{word: frequency}
        
        word_freq = Counter()

        for text in corpus:
            # print('text----', text)
            #  split into words and add special end token
            words = re.findall(r'\w+|\s', text.lower())
            # print('words----', words)

            for word in words:
                #  add end-of-word makers
                word_with_marker = tuple(word + '</w>')
                # print('word_with_marker----', word_with_marker)
                word_freq[word_with_marker] += 1

        # should outside the loop
        return word_freq

    
    def encode(self, text):
        # print("Warning: encode() not implemented yet")
        return []
    
    def decode(self, text):
        # print("Warning: decode() not implemented yet")
        return ""
    



# Training corpus
corpus = [
    "low low low low lower lowest",
    "the quick brown fox jumps over the lazy dog",
    "hello world hello world hello",
    "machine learning is awesome",
    "natural language processing"
]

# Train BPE
bpe = BytePairEncoding(vocab_size = 200)
bpe.train(corpus)

# Encode text 
text = 'hello world lower'
encodedText = bpe.encode(text)

bpe._get_word_frequencies(corpus)



print(f"\n Original: {text}")
# encodedText = bpe.encode(text)
print(f"\n encoded: {encodedText}")

# Decode back
decodedText = bpe.decode(encodedText)


