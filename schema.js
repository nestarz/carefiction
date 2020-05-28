const data = {
  pages: [
    {
      createdAt,
      title,
      image,
      paragraphs: [
        {
          createdAt,
          gaps: [
            {
              createdAt,
              type,
              editable,
              values: [
                {
                  createdAt,
                  value,
                },
              ],
            },
          ],
        },
      ],
    },
    ,
  ],
};

useEffect(() => {
    setTimeout(() => node.get("title").put("lol"), 1000);
  }, []);