import json

def parse_link(link):
    space_delimited = link.split()
    url = space_delimited[-1][1:-1]

    section_part = space_delimited[-2]
    section_part_split = section_part.split('-')
    section = section_part_split[0]
    part = section_part_split[1][0]

    song = ''.join(space_delimited[:-2])[7:]
    if song[-1] == '-':
        song = song[:-1]
    return song, section, url

def get_section(section):
    section = section.lower()
    if section == "clarz" or section == "picz":
        section = "cpg"
    return section

def add_song(songs_dict, song, section, url):
    song_list = songs_dict[section]
    if len(song_list) != 0 and song_list[-1]["title"] == song:
        # have this song already, append url
        song_list[-1]["urls"].append(url)
    else:
        # new song, add to list
        song = {"title": song, "urls": [url]}
        song_list.append(song)

def main():
    song_titles = []
    song_aliases = []
    songs_dict = {"altoz": [],
                  "bonz": [],
                  "cpg": [],
                  "mellz": [],
                  "tenrz": [],
                  "toobz": [],
                  "trumpz": []}

    link_file = open("Songs/urls.txt")
    for link in link_file:
        song, section, url = parse_link(link)
        if song not in song_titles:
            song_titles.append(song)
            song_aliases.append({song: []})
        get_section(section)
        add_song(songs_dict, song, get_section(section), url)

    with open('song_urls.json', 'w') as outfile:
        json.dump({"songs": songs_dict}, outfile, indent=4)
    with open('alias_placeholder.json', 'w') as aliasfile:
        json.dump({"aliases": song_aliases}, aliasfile, indent=4)

if __name__ == "__main__":
    main()