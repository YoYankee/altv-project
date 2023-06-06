﻿using AltV.Net;

namespace MainResource.Factory.Player;

/// <summary>
/// 玩家工厂实体
/// </summary>
public class IPlayer : AltV.Net.Elements.Entities.Player
{
    public IPlayer(ICore core, IntPtr nativePointer, uint id) : base(core, nativePointer, id)
    {
    }

    public int PlayerId { get; set; }
    public int PlayerName { get; set; }
}