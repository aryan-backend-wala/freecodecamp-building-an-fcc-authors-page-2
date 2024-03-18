const forumLatest = "https://forum-proxy.freecodecamp.rocks/latest";
const forumTopicUrl = "https://forum.freecodecamp.org/t/";
const forumCategoryUrl = "https://forum.freecodecamp.org/c/";
const avatarUrl = "https://sea1.discourse-cdn.com/freecodecamp";

const postsContainer = document.getElementById('posts-container');

const allCategories = {
  299: { category: "Career Advice", className: "career" },
  409: { category: "Project Feedback", className: "feedback" },
  417: { category: "freeCodeCamp Support", className: "support" },
  421: { category: "JavaScript", className: "javascript" },
  423: { category: "HTML - CSS", className: "html-css" },
  424: { category: "Python", className: "python" },
  432: { category: "You Can Do This!", className: "motivation" },
  560: { category: "Backend Development", className: "backend" },
};

const forumCategory = (id) => {
  const selectedCategory = {};
  if(allCategories.hasOwnProperty(id)){
    const { category, className } = allCategories[id];
    selectedCategory.category = category;
    selectedCategory.className = className;
  } else {
    selectedCategory.category = "General";
    selectedCategory.className = "general";
    selectedCategory.id = 1;
  }

  const url = `${forumCategoryUrl}${selectedCategory.className}/${id}`;
  const linkText = selectedCategory.category;
  const linkClass = `category ${selectedCategory.className}`;
  return `<a href="${url}" target="_blank" class="${linkClass}">${linkText}</a>`
};

const timeAgo = (time) => {
  const currentTime = new Date();
  const lastPost = new Date(time);
  const timeDiffernce = currentTime - lastPost;
  const msPerMinute = 1000 * 60;
  const minutesAgo = Math.floor(timeDiffernce / msPerMinute);
  const hoursAgo = Math.floor(timeDiffernce / minutesAgo);
  const daysAgo = Math.floor(timeDiffernce / hoursAgo);
  if(minutesAgo < 60){
    return `${minutesAgo}m ago`;
  }
  if(hoursAgo < 60){
    return `${hoursAgo}h ago`;
  }
  return `${daysAgo}d ago`;
};

const viewCount = (views) => {
  const thousands = Math.floor(views / 1000);

  if(views >= 1000){
    return `${thousands}k`;
  }
  return views;
};

const avatars = (posters, users) => {
  return posters
    .map((poster) => {
    const user = users.find((user) => user.id === poster.user_id);
    console.log(user);
    if(user){
      const avatar = user.avatar_template.replace(/{size}/, 30);
      console.log(avatar);
      const userAvatarUrl = avatar.startsWith("/user_avatar/") 
        ? avatarUrl.concat(avatar)
        : avatar;
      return `<img src="${userAvatarUrl}" alt="${user.name}">`
    }
  }).join("");
};

const fetchData = async () => {
  try {
    const res = await fetch(forumLatest);
    const data = await res.json();
    showLatestPosts(data);
  } catch (err) {
    console.log(err);
  }
};

fetchData();

const showLatestPosts = (data) => {
  const { topic_list, users } = data;
  const { topics } = topic_list;

  postsContainer.innerHTML = topics.map((item) => {
    const {
      id,
      title,
      views,
      posts_count,
      slug,
      posters,
      category_id,
      bumped_at,
    } = item;
    return `
    <tr>
      <td>
        <a class="post-title">${title}</a>

        ${forumCategory(category_id)}
      </td>
      <td>
        <div class="avatar-container">
          ${avatars(posters, users)}
        </div>
      </td>
      <td>${posts_count - 1}</td>
      <td>${viewCount(views)}</td>
      <td>${timeAgo(bumped_at)}</td>
    </tr>`;
  }).join("");
};

