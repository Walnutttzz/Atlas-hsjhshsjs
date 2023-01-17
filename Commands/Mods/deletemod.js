const mongoose = require("mongoose");
require("../../config.js");
require("../../Core.js");
const { mku } = require("../../lib/dataschema.js");

module.exports = {
  name: "delmod",
  alias: ["removemod", "unmod", "deleteMod"],
  desc: "To remove an user from Mod",
  category: "Mods",
  usage: "delmod @user",
  react: "🔨",
  start: async (
    Miku,
    m,
    { text, prefix, mentionByTag, pushName, isCreator, owner, includes }
  ) => {
    var modStatus = await mku
      .findOne({ id: m.sender })
      .then(async (user) => {
        if (user.addedMods == "true") {
          return "true";
        } else {
          return "false";
        }
      })
      .catch((error) => {
        console.log(error);
      });

    if (!isCreator && !modStatus == "true")
      return Miku.sendMessage(
        m.from,
        { text: "Sorry, only my *Devs* and *Mods* can use this command !" },
        { quoted: m }
      );
    //var TaggedUser = mentionByTag[0];

    if (!text && !m.quoted) {
      return Miku.sendMessage(
        m.from,
        { text: `Please tag a *Mod* to remove from *Moderation* !` },
        { quoted: m }
      );
    } else if (m.quoted) {
      var mentionedUser = m.quoted.sender;
    } else {
      var mentionedUser = mentionByTag[0];
    }
    //var mentionedUser = mentionByTag;
    let userId = (await mentionedUser) || m.msg.contextInfo.participant;
    try {
      var ownerlist = global.owner;
      mku
        .findOne({ id: userId })
        .then(async (user) => {
          if (ownerlist.includes(`${mentionedUser.split("@")[0]}`)) {
            return Miku.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } is an *Owner* and cannot be removed from mod !`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          } else if (user &&!ownerlist.includes(`${mentionedUser.split("@")[0]}`)) {
            await mku.findOneAndUpdate({ id: userId }, { addedMods: false }, { new: true });
            return Miku.sendMessage(
              m.from,
              {
                text: `@${
                  mentionedUser.split("@")[0]
                } has been removed from *Mods* Successfully !`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          } else {
            return Miku.sendMessage(
              m.from,
              {
                text: `@${mentionedUser.split("@")[0]} is not a *Mod* !`,
                mentions: [mentionedUser],
              },
              { quoted: m }
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  },
};
